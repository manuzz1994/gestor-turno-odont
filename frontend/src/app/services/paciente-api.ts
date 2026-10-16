import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Paciente, PacienteInput } from '../models/paciente';

@Injectable({ providedIn: 'root' })
export class PacienteApi {
  private http = inject(HttpClient);
  private url = `${API_URL}/paciente`;

  getAll(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.url);
  }

  getById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  create(data: PacienteInput): Observable<Paciente> {
    return this.http.post<Paciente>(this.url, data);
  }

  update(id: number, data: PacienteInput): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.url}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}