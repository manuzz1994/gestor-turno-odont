import type { Request, Response, NextFunction } from 'express';

export function notFound(req: Request, res: Response) {
    res.status(404).json({error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,});}
    
// Tiene que tener los 4 parámetros para que Express
// lo reconozca como handler de errores

export function errorHandler(
    err: unknown, _req: Request, res: Response, _next: NextFunction
) {
    const code = (err as { code?: string })?.code;
    const sqlMessage = (err as { sqlMessage?: string })?.sqlMessage ?? '';

    // Restricciones UNIQUE: uq_doctor_dni, uq_paciente_dni, uq_turno_doctor_fecha_hora
    if (code === 'ER_DUP_ENTRY') {
        const error = sqlMessage.includes('uq_turno')
            ? 'El doctor ya tiene un turno en ese horario'
            : 'Ya existe un registro con ese DNI';
        res.status(409).json({ error });
        return;
    }

    // Claves foraneas: fk_turno_doctor, fk_turno_paciente
    if (code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({ error: 'El doctor o el paciente no existe' });
        return;
    }

    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
}