import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paciente, PacienteInput } from '../../models/paciente';
import { PacienteApi } from '../../services/paciente-api';
import { mensajeError } from '../../utils/errores';

@Component({
  selector: 'app-pacientes',
  imports: [ReactiveFormsModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css',
})
export class Pacientes implements OnInit {
  private api = inject(PacienteApi);
  private fb = inject(FormBuilder);

  pacientes = signal<Paciente[]>([]);
  editandoId = signal<number | null>(null);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    dni: [null as number | null, [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
    nombre: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(50)]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.api.getAll().subscribe({
      next: (lista) => this.pacientes.set(lista),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }

  campoInvalido(nombre: string): boolean {
    const c = this.form.get(nombre);
    return !!c && c.invalid && c.touched;
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: PacienteInput = {
      dni: Number(v.dni),
      nombre: v.nombre.trim(),
      apellido: v.apellido.trim(),
      telefono: v.telefono.trim(),
    };

    const id = this.editandoId();
    const peticion = id === null ? this.api.create(datos) : this.api.update(id, datos);

    peticion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }

  editar(p: Paciente) {
    this.error.set(null);
    this.editandoId.set(p.id);
    this.form.setValue({ dni: p.dni, nombre: p.nombre, apellido: p.apellido, telefono: p.telefono });
  }

  cancelar() {
    this.editandoId.set(null);
    this.error.set(null);
    this.form.reset();
  }

  eliminar(p: Paciente) {
    if (!confirm(`¿Eliminar a ${p.nombre} ${p.apellido}? También se borrarán sus turnos.`)) return;
    this.api.remove(p.id).subscribe({
      next: () => this.cargar(),
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }
}