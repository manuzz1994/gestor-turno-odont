import type { Request, Response } from 'express';
import { PacienteModel, type PacienteInput } from '../models/paciente.model';

type IdParams = {id: string};

function parseId(value: string): number | null{
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id:null;
}

function isPacienteInput(body:any): body is PacienteInput{
    return(
        Number.isInteger(body?.dni) && body.dni >= 0 &&
        typeof body?.nombre === 'string' && body.nombre.trim() !== '' && body.nombre.length <= 50 &&
        typeof body?.apellido === 'string' && body.apellido.trim() !== '' && body.apellido.length <= 50 &&
        typeof body?.telefono === 'string' && body.telefono.length >= 10 && body.telefono.length <= 20
    )
}

export const getAll = async (_req: Request, res: Response)=> {
    res.json(await PacienteModel.findAll());
}

export const getById = async (req: Request<IdParams>, res : Response) => {
    const id= parseId(req.params.id);
    if (!id){res.status(400).json({error: 'id invalido'}); return;}

    const paciente = await PacienteModel.findById(id);
    if(!paciente){res.status(404).json({error: 'Paciente no encontrado'}); return;}

    res.json(paciente);
}

export const create = async (req: Request, res: Response)=> {
    if(!isPacienteInput(req.body)){
        res.status(400).json({error: 'datos invalidos: dni, nombre, apellido, telefono son obligatorios',});
        return
    }
    const nuevo = await PacienteModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response)=> {
    const id = parseId(req.params.id);
    if(!id){ res.status(400).json({error: 'ID no valido'}); return;}
    if(!isPacienteInput(req.body)){
        res.status(400).json({error:'Datos invalidos'});
        return;
    }

    const ok = await PacienteModel.update(id, req.body);
    if(!ok){res.status(404).json({error:'Paciente no encontrado'}); return;}

    res.json({id, ...req.body});
};


export const remove = async (req: Request<IdParams>, res:Response)=>{
    const id= parseId(req.params.id);
    if(!id){res.status(400).json({error:'Id invalido'}); return}

    const ok = await PacienteModel.remove(id);
    if(!ok){res.status(404).json({error:'Paciente no encontrado'}); return ;}

    res.status(204).send();
};