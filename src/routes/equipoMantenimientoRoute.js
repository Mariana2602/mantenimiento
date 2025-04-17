import { Router } from 'express';
import listarEquipos from '../controllers/equipoMantenimientoController.js'

const router = Router();

router.get('/equipo', listarEquipos);

export default router;