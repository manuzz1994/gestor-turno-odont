import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Turno, TurnoConPaciente, TurnoInput } from '../models/turno';

@Injectable({ providedIn: 'root' })
export class TurnoApi {
  private http = inject(HttpClient);
  private url = `${API_URL}/turno`;

  getAll(): Observable<TurnoConPaciente[]> {
    return this.http.get<TurnoConPaciente[]>(this.url);
  }

  getById(id: number): Observable<TurnoConPaciente> {
    return this.http.get<TurnoConPaciente>(`${this.url}/${id}`);
  }

  create(data: TurnoInput): Observable<Turno> {
    return this.http.post<Turno>(this.url, data);
  }

  update(id: number, data: TurnoInput): Observable<Turno> {
    return this.http.put<Turno>(`${this.url}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}