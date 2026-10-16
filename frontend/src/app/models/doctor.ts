export interface Doctor {
  id: number;
  dni: number;
  nombre: string;
  apellido: string;
  telefono: string;
}
export type DoctorInput = Omit<Doctor, 'id'>;