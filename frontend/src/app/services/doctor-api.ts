import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Doctor, DoctorInput } from '../models/doctor';

@Injectable({ providedIn: 'root' })
export class DoctorApi {
  private http = inject(HttpClient);
  private url = `${API_URL}/doctor`;

  getAll(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.url);
  }

  getById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.url}/${id}`);
  }

  create(data: DoctorInput): Observable<Doctor> {
    return this.http.post<Doctor>(this.url, data);
  }

  update(id: number, data: DoctorInput): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.url}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}