import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'resources', 
    loadComponent: () => import('./components/resources/resource-list/resource-list.component').then(m => m.ResourceListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'sessions/new', 
    loadComponent: () => import('./components/sessions/session-form/session-form.component').then(m => m.SessionFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'sessions/:id/edit', 
    loadComponent: () => import('./components/sessions/session-form/session-form.component').then(m => m.SessionFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    loadComponent: () => import('./components/shared/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];