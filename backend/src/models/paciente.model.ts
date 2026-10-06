import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/db';


export interface Paciente {
    id: number;
    dni: number;
    nombre: string;
    apellido:string
    telefono: string;
}


export type PacienteInput = Omit<Paciente, 'id'>;

interface PacienteRow extends RowDataPacket, Paciente {}

export const PacienteModel={

    async findAll(): Promise<Paciente[]>{
        const [rows] = await pool.query<PacienteRow[]>(
            'SELECT id, dni, nombre, apellido, telefono FROM paciente'
        );
        return rows;
    },

    async findById(id:number): Promise<Paciente | null> {
        const [rows]= await pool.query<PacienteRow[]>(
            'SELECT id, dni, apellido, nombre, telefono FROM paciente WHERE id= ?',
            [id]
        );
        return rows[0] ?? null;
    },

    async create(data:PacienteInput): Promise<Paciente>{
        const [result]=  await pool.query<ResultSetHeader>(
            'INSERT INTO paciente (dni, nombre, apellido, telefono) VALUES (?, ?, ?, ?)',
            [data.dni, data.nombre, data.apellido, data.telefono]
        );
        return { id: result.insertId, ...data};
    },

    async update(id: number, data: PacienteInput): Promise<boolean>{
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE paciente SET dni= ?, nombre= ?, apellido = ?, telefono = ? WHERE id= ?',
            [data.dni, data.nombre, data.apellido, data.telefono, id]
        );
        return result.affectedRows> 0;

    },

    async remove(id: number): Promise<boolean>{
        const [result]= await pool.query<ResultSetHeader>(
            'DELETE FROM paciente WHERE id= ?',
            [id]
        );
        return result.affectedRows > 0;
    }


}