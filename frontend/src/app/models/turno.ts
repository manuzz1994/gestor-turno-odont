export interface Turno {
  id: number;
  fecha: string;
  hora: string;
  observaciones: string | null;
  id_doctor: number;
  id_paciente: number;
}
export type TurnoInput = Omit<Turno, 'id'>;

export interface TurnoConPaciente extends Turno {
  paciente_nombre: string;
  paciente_apellido: string;
  paciente_dni: number;
  paciente_telefono: string;
}