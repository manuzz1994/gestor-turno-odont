// turno.ts
export interface Turno {
  id: number;
  fecha: string;          // 'yyyy-mm-dd'
  hora: string;           // 'HH:mm' o 'HH:mm:ss'
  observaciones: string | null;
  id_doctor: number;
  id_paciente: number;
}
export type TurnoInput = Omit<Turno, 'id'>;

// Lo que devuelve GET /turno (incluye datos del paciente)
export interface TurnoConPaciente extends Turno {
  paciente_nombre: string;
  paciente_apellido: string;
  paciente_dni: number;
  paciente_telefono: string;
}