import { Router } from 'express';
import pacienteRoutes from './paciente.routes';
import doctorRoutes from './doctor.routes';
import turnoRoutes from './turno.routes'

const router = Router();

router.use('/paciente', pacienteRoutes);
router.use('/doctor', doctorRoutes);
router.use('/turno', turnoRoutes);

export default router;