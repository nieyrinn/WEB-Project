import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
register(registerData: RegisterRequest): Observable<any> {
  return this.http.post(`${this.apiUrl}/register/`, registerData)
    .pipe(
      catchError(error => {
        return throwError(() => new Error('Registration failed: ' + (error.error?.error || error.message || 'Unknown error')));
      })
    );
}
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, loginData)
      .pipe(
        tap(response => {
          // Store user details and tokens in local storage
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          return throwError(() => new Error('Login failed: ' + (error.error?.error || 'Unknown error')));
        })
      );
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post(`${this.apiUrl}/logout/`, { refresh: refreshToken })
      .pipe(
        tap(() => {
          // Clear stored data
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        }),
        catchError(error => {
          return throwError(() => new Error('Logout failed: ' + error.message));
        })
      );
  }

  refreshToken(): Observable<{ access: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<{ access: string }>(`${this.apiUrl}/refresh/`, { refresh: refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access);
        })
      );
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
