import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/db';

export interface Turno {
    id: number;
    fecha:string;
    hora: string;
    observaciones:string | null;
    id_doctor: number;
    id_paciente: number;
}


export type TurnoInput = Omit<Turno, 'id'>;

// Turno con los datos del paciente, para el calendario y la card
export interface TurnoConPaciente extends Turno {
    paciente_nombre: string;
    paciente_apellido: string;
    paciente_dni: number;
    paciente_telefono: string;
}

interface TurnoRow extends RowDataPacket, TurnoConPaciente{}


export const TurnoModel = {

    async findAll(): Promise<TurnoConPaciente[]>{
        const [rows]= await pool.query<TurnoRow[]>(
            'SELECT t.id, t.fecha, t.hora, t.observaciones, t.id_doctor, t.id_paciente, ' +
            'p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, ' +
            'p.dni AS paciente_dni, p.telefono AS paciente_telefono ' +
            'FROM turno t JOIN paciente p ON p.id = t.id_paciente'
        );
        return rows;
    },

    async findById(id:number): Promise<TurnoConPaciente | null>{
        const [rows]= await pool.query<TurnoRow[]>(
            'SELECT t.id, t.fecha, t.hora, t.observaciones, t.id_doctor, t.id_paciente, ' +
            'p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, ' +
            'p.dni AS paciente_dni, p.telefono AS paciente_telefono ' +
            'FROM turno t JOIN paciente p ON p.id = t.id_paciente WHERE t.id= ?',
            [id]
        );
        return rows[0] ?? null;
    },

    // true si el doctor ya tiene otro turno ese dia a menos de 60 minutos.
    // excluirId se usa en el update para no comparar el turno consigo mismo.
    async hayConflicto(data: TurnoInput, excluirId = 0): Promise<boolean>{
        const [rows]= await pool.query<RowDataPacket[]>(
            'SELECT id FROM turno WHERE id_doctor= ? AND fecha= ? AND id <> ? ' +
            'AND ABS(TIME_TO_SEC(TIMEDIFF(hora, ?))) < 3600 LIMIT 1',
            [data.id_doctor, data.fecha, excluirId, data.hora]
        );
        return rows.length > 0;
    },

    async create(data: TurnoInput): Promise<Turno>{
        const [result]= await pool.query<ResultSetHeader>(
            'INSERT INTO turno (fecha, hora, observaciones, id_doctor, id_paciente) VALUES (?, ?, ?, ?, ?)',
            [data.fecha, data.hora, data.observaciones, data.id_doctor, data.id_paciente]
        );
        return {id: result.insertId, ...data};
    },

    async update(id: number, data: TurnoInput): Promise<boolean>{
        const [result]= await pool.query<ResultSetHeader>(
            'UPDATE turno SET fecha= ?, hora=?, observaciones=?, id_doctor=?, id_paciente=? WHERE id=?',
            [data.fecha, data.hora, data.observaciones, data.id_doctor, data.id_paciente, id]
        );
        return result.affectedRows > 0;
    },


    async remove(id:number): Promise<boolean>{
        const [result]= await pool.query<ResultSetHeader>(
            'DELETE FROM turno WHERE id= ?',
            [id]
        );
        return result.affectedRows > 0;
    }



}