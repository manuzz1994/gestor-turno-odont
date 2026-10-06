import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/db';


export interface Doctor {
    id: number;
    dni: number;
    nombre: string;
    apellido:string
    telefono: string;
}



export type DoctorInput = Omit<Doctor, 'id'>;

interface DoctorRow extends RowDataPacket, Doctor {}

export const DoctorModel={

    async findAll(): Promise<Doctor[]>{
        const [rows] = await pool.query<DoctorRow[]>(
            'SELECT id, dni, nombre, apellido, telefono FROM doctor'
        );
        return rows;
    },

    async findById(id:number): Promise<Doctor | null> {
        const [rows]= await pool.query<DoctorRow[]>(
            'SELECT id, dni, apellido, nombre, telefono FROM doctor WHERE id= ?',
            [id]
        );
        return rows[0] ?? null;
    },

    async create(data:DoctorInput): Promise<Doctor>{
        const [result]=  await pool.query<ResultSetHeader>(
            'INSERT INTO doctor (dni, nombre, apellido, telefono) VALUES (?, ?, ?, ?)',
            [data.dni, data.nombre, data.apellido, data.telefono]
        );
        return { id: result.insertId, ...data};
    },

    async update(id: number, data: DoctorInput): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE doctor SET dni= ?, nombre= ?, apellido = ?, telefono = ? WHERE id= ?',
            [data.dni, data.nombre, data.apellido, data.telefono, id]
        );
        return result.affectedRows> 0;

    },

    async remove(id: number): Promise<boolean>{
        const [result]= await pool.query<ResultSetHeader>(
            'DELETE FROM doctor WHERE id= ?',
            [id]
        );
        return result.affectedRows > 0;
    }


}