import { Injectable, signal } from '@angular/core';
import { Doctor } from '../models/doctor';

@Injectable({ providedIn: 'root' })
export class SesionDoctor {
  doctorActual = signal<Doctor | null>(null);
}
