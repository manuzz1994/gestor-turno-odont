export interface Paciente {
  id: number;
  dni: number;
  nombre: string;
  apellido: string;
  telefono: string;
}
export type PacienteInput = Omit<Paciente, 'id'>;