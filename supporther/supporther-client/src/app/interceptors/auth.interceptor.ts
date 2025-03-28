import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const authToken = localStorage.getItem('access_token');
  
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  if (authToken) {
    req = addToken(req, authToken);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService, router: Router) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(token => {
        isRefreshing = false;
        refreshTokenSubject.next(token.access);
        return next(addToken(request, token.access));
      }),
      catchError(error => {
        isRefreshing = false;
        authService.logout().subscribe();
        router.navigate(['/login']);
        return throwError(() => new Error('Session expired. Please login again.'));
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(jwt => next(addToken(request, jwt!)))
    );
  }
}