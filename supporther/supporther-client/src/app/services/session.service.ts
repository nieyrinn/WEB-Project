import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportSession } from '../models/session.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = `${environment.apiUrl}/sessions`;

  constructor(private http: HttpClient) {}

  getUserSessions(): Observable<SupportSession[]> {
    return this.http.get<SupportSession[]>(`${this.apiUrl}/`);
  }

  getSessionById(id: number): Observable<SupportSession> {
    return this.http.get<SupportSession>(`${this.apiUrl}/${id}/`);
  }

  createSession(session: Partial<SupportSession>): Observable<SupportSession> {
    return this.http.post<SupportSession>(`${this.apiUrl}/`, session);
  }

  updateSession(id: number, session: Partial<SupportSession>): Observable<SupportSession> {
    return this.http.put<SupportSession>(`${this.apiUrl}/${id}/`, session);
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}