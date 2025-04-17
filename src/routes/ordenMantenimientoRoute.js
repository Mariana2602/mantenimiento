import { Router } from 'express';
import { listarMantenimientos, obtenerEquiposRepuestos, registrarMantenimiento, eliminarMantenimiento, obtenerMantenimientoEdicion, actualizarMantenimientoController } from '../controllers/ordenMantenimientoController.js';

const router = Router();

router.get('/mantenimiento', listarMantenimientos);
router.get('/datos-formulario', obtenerEquiposRepuestos);
router.post('/registro', registrarMantenimiento);
router.delete('/eliminar/:id', eliminarMantenimiento);
router.get('/actualizar/:id', obtenerMantenimientoEdicion);
router.put('/actualizar/:id', actualizarMantenimientoController);

export default router;