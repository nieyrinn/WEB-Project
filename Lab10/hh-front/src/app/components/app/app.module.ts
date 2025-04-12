// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { VacanciesComponent } from '../vacancies/vacancies.component';
import { CompaniesComponent } from '../companies/companies.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    CompaniesComponent,
    VacanciesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    provideHttpClient() 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }