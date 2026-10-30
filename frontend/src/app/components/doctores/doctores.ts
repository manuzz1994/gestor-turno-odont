import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Doctor, DoctorInput } from '../../models/doctor';
import { DoctorApi } from '../../services/doctor-api';
import { mensajeError } from '../../utils/errores';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-doctores',
  styleUrl: './doctores.css',
  templateUrl: './doctores.html',
})
export class Doctores {
  private api = inject(DoctorApi);
  private fb = inject(FormBuilder);

  creado = output<Doctor>();
  cerrar = output<void>();

  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    dni: [null as number | null, [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
    nombre: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(50)]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
  });

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
    const datos: DoctorInput = {
      dni: Number(v.dni),
      nombre: v.nombre.trim(),
      apellido: v.apellido.trim(),
      telefono: v.telefono.trim(),
    };

    this.api.create(datos).subscribe({
      next: (nuevo) => {
        this.form.reset();
        this.error.set(null);
        this.creado.emit(nuevo);
      },
      error: (e: HttpErrorResponse) => this.error.set(mensajeError(e)),
    });
  }

  cancelar() {
    this.form.reset();
    this.error.set(null);
    this.cerrar.emit();
  }
}
