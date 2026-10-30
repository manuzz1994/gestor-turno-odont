import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Doctores } from './components/doctores/doctores';
import { Pacientes } from './components/pacientes/pacientes';
import { Turnos } from './components/turnos/turnos';
import { Doctor } from './models/doctor';
import { DoctorApi } from './services/doctor-api';
import { SesionDoctor } from './services/sesion-doctor';
import { mensajeError } from './utils/errores';

type Seccion = 'agenda' | 'pacientes';

@Component({
  selector: 'app-root',
  imports: [Doctores, Pacientes, Turnos],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private doctorApi = inject(DoctorApi);
  sesion = inject(SesionDoctor);

  doctores = signal<Doctor[]>([]);
  seccion = signal<Seccion>('agenda');
  error = signal<string | null>(null);
  agregandoDoctor = signal(false);

  ngOnInit() {
    this.doctorApi.getAll().subscribe({
      next: (lista) => this.doctores.set(lista),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }

  elegir(id: number) {
    this.sesion.doctorActual.set(this.doctores().find((d) => d.id === id) ?? null);
  }

  doctorCreado(nuevo: Doctor) {
    this.doctores.update((lista) => [...lista, nuevo]);
    this.error.set(null);
    this.agregandoDoctor.set(false);
  }
}