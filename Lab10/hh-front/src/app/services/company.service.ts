import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../interfaces/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private url = 'http://127.0.0.1:8000/api/companies/';  

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.url);
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(this.url + id + '/');
  }
}