import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacancy } from '../interfaces/vacancy';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  private url = 'http://127.0.0.1:8000/api/companies/'; 

  constructor(private http: HttpClient) { }

  getVacancies(): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(this.url);
  }

  getVacanciesByCompanyId(companyId: number): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(`${this.url}${companyId}/vacancies/`);
  }
}