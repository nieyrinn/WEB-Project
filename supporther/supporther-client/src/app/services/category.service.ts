import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportCategory } from '../models/category.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<SupportCategory[]> {
    return this.http.get<SupportCategory[]>(`${this.apiUrl}/`);
  }

  createCategory(category: Partial<SupportCategory>): Observable<SupportCategory> {
    return this.http.post<SupportCategory>(`${this.apiUrl}/`, category);
  }
}