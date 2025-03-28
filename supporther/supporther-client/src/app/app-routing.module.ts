// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResourceListComponent } from './components/resources/resource-list/resource-list.component';
import { SessionFormComponent } from './components/sessions/session-form/session-form.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';

// Guard
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/auth/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'resources', component: ResourceListComponent, canActivate: [authGuard] },
  { path: 'sessions/new', component: SessionFormComponent, canActivate: [authGuard] },
  { path: 'sessions/:id/edit', component: SessionFormComponent, canActivate: [authGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }