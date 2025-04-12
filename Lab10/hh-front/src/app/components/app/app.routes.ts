import { Routes } from '@angular/router';
import { CompaniesComponent } from '../companies/companies.component';
import { VacanciesComponent } from '../vacancies/vacancies.component';

export const routes: Routes = [
  { path: '', redirectTo: '/companies', pathMatch: 'full' },
  { path: 'companies', component: CompaniesComponent }, // Route for companies list
  { path: 'companies/:id/vacancies', component: VacanciesComponent }, // Route for vacancies by company
];