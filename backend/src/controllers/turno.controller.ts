import type { Request, Response } from 'express';
import { TurnoModel, type TurnoInput } from '../models/turno.model';

type IdParams = {id: string};

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

function parseId(value: string): number | null{
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id:null;
}

function isTurnoInput(body:any): body is TurnoInput{
    return(
        typeof body?.fecha === 'string' && FECHA_REGEX.test(body.fecha) &&
        typeof body?.hora === 'string' && HORA_REGEX.test(body.hora) &&
        (body?.observaciones === null || (typeof body?.observaciones === 'string' && body.observaciones.length <= 200)) &&
        Number.isInteger(body?.id_doctor) && body.id_doctor > 0 &&
        Number.isInteger(body?.id_paciente) && body.id_paciente > 0
    )
}

export const getAll = async (_req: Request, res: Response)=> {
    res.json(await TurnoModel.findAll());
}

export const getById = async (req: Request<IdParams>, res : Response) => {
    const id= parseId(req.params.id);
    if (!id){res.status(400).json({error: 'Id invalido'}); return;}

    const turno = await TurnoModel.findById(id);
    if(!turno){res.status(404).json({error: 'Turno no encontrado'}); return;}

    res.json(turno);
}

export const create = async (req: Request, res: Response)=> {
    if(!isTurnoInput(req.body)){
        res.status(400).json({error: 'Datos invalidos: fecha, hora, id_doctor e id_paciente son obligatorios; observaciones puede ser null',});
        return
    }
    if(await TurnoModel.hayConflicto(req.body)){res.status(409).json({error: 'El doctor ya tiene un turno a menos de 60 minutos de ese horario'}); return;}

    const nuevo = await TurnoModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response)=> {
    const id = parseId(req.params.id);
    if(!id){ res.status(400).json({error: 'Id invalido'}); return;}
    if(!isTurnoInput(req.body)){
        res.status(400).json({error:'Datos invalidos'});
        return;
    }

    if(await TurnoModel.hayConflicto(req.body, id)){res.status(409).json({error: 'El doctor ya tiene un turno a menos de 60 minutos de ese horario'}); return;}

    const ok = await TurnoModel.update(id, req.body);
    if(!ok){res.status(404).json({error:'Turno no encontrado'}); return;}

    res.json({id, ...req.body});
};


export const remove = async (req: Request<IdParams>, res:Response)=>{
    const id= parseId(req.params.id);
    if(!id){res.status(400).json({error:'Id invalido'}); return}

    const ok = await TurnoModel.remove(id);
    if(!ok){res.status(404).json({error:'Turno no encontrado'}); return ;}

    res.status(204).send();
};
