import { HttpErrorResponse } from '@angular/common/http';

export function mensajeError(e: HttpErrorResponse): string {
  if (e.status === 0) return 'No se pudo conectar con el servidor';
  return e.error?.error ?? 'Ocurrió un error inesperado';
}