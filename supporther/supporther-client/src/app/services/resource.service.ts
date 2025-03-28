import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resource } from '../models/resource.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/resources`;

  constructor(private http: HttpClient) {}

  getAllResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/`);
  }

  getResourcesByCategory(categoryId: number): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/category/${categoryId}/`);
  }

  createResource(resource: Partial<Resource>): Observable<Resource> {
    return this.http.post<Resource>(`${this.apiUrl}/`, resource);
  }
}