import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paciente } from '../../models/paciente';
import { TurnoConPaciente, TurnoInput } from '../../models/turno';
import { PacienteApi } from '../../services/paciente-api';
import { SesionDoctor } from '../../services/sesion-doctor';
import { TurnoApi } from '../../services/turno-api';
import { mensajeError } from '../../utils/errores';

// Fecha de hoy como 'yyyy-mm-dd' en hora local (toISOString usaría UTC y podría correr el día)
function hoy(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-turnos',
  imports: [ReactiveFormsModule],
  templateUrl: './turnos.html',
  styleUrl: './turnos.css',
})
export class Turnos implements OnInit {
  private turnoApi = inject(TurnoApi);
  private pacienteApi = inject(PacienteApi);
  private fb = inject(FormBuilder);
  private sesion = inject(SesionDoctor);

  turnos = signal<TurnoConPaciente[]>([]);
  pacientes = signal<Paciente[]>([]);
  fecha = signal(hoy());
  editandoId = signal<number | null>(null);
  error = signal<string | null>(null);

  // slice(0, 10) tolera que la fecha llegue como '2026-10-20T03:00:00.000Z'
  turnosDelDia = computed(() => {
    const doctor = this.sesion.doctorActual();
    return this.turnos()
      .filter((t) => t.id_doctor === doctor?.id && t.fecha.slice(0, 10) === this.fecha())
      .sort((a, b) => a.hora.localeCompare(b.hora));
  });

  form = this.fb.nonNullable.group({
    id_paciente: [null as number | null, Validators.required],
    fecha: [hoy(), Validators.required],
    hora: ['', Validators.required],
    observaciones: ['', Validators.maxLength(200)],
  });

  constructor() {
    // Si cambia el doctor, se cancela cualquier edición en curso
    effect(() => {
      this.sesion.doctorActual();
      untracked(() => this.cancelar());
    });
  }

  ngOnInit() {
    this.cargar();
    this.pacienteApi.getAll().subscribe({
      next: (lista) => this.pacientes.set(lista),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }

  cargar() {
    this.turnoApi.getAll().subscribe({
      next: (lista) => this.turnos.set(lista),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }

  cambiarFecha(f: string) {
    if (!f) return;
    this.fecha.set(f);
    if (this.editandoId() === null) this.form.patchValue({ fecha: f });
  }

  campoInvalido(nombre: string): boolean {
    const c = this.form.get(nombre);
    return !!c && c.invalid && c.touched;
  }

  guardar() {
    const doctor = this.sesion.doctorActual();
    if (!doctor) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: TurnoInput = {
      fecha: v.fecha,
      hora: v.hora,
      observaciones: v.observaciones.trim() || null,
      id_doctor: doctor.id,
      id_paciente: Number(v.id_paciente),
    };

    const id = this.editandoId();
    const peticion = id === null ? this.turnoApi.create(datos) : this.turnoApi.update(id, datos);

    peticion.subscribe({
      next: () => {
        this.fecha.set(datos.fecha);
        this.cancelar();
        this.cargar();
      },
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }

  editar(t: TurnoConPaciente) {
    this.error.set(null);
    this.editandoId.set(t.id);
    this.form.setValue({
      id_paciente: t.id_paciente,
      fecha: t.fecha.slice(0, 10),
      hora: t.hora.slice(0, 5),
      observaciones: t.observaciones ?? '',
    });
  }

  cancelar() {
    this.editandoId.set(null);
    this.error.set(null);
    this.form.reset({ id_paciente: null, fecha: this.fecha(), hora: '', observaciones: '' });
  }

  eliminar(t: TurnoConPaciente) {
    if (!confirm(`¿Eliminar el turno de ${t.paciente_nombre} ${t.paciente_apellido}?`)) return;
    this.turnoApi.remove(t.id).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }
}