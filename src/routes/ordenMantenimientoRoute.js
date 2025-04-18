import { Router } from 'express';
import { listarMantenimientos, 
         obtenerEquiposRepuestos, 
         registrarMantenimiento, 
         eliminarMantenimiento, 
         obtenerMantenimientoEdicion, 
         actualizarMantenimientoController,
         crearOrdenTrabajoController,
         obtenerEmpleadoController} from '../controllers/ordenMantenimientoController.js';

const router = Router();

router.get('/mantenimiento', listarMantenimientos);
router.get('/datos-formulario', obtenerEquiposRepuestos);
router.post('/registro', registrarMantenimiento);
router.delete('/eliminar/:id', eliminarMantenimiento);
router.get('/actualizar/:id', obtenerMantenimientoEdicion);
router.put('/enviar/:id', actualizarMantenimientoController);
router.get('/empleado-orden', obtenerEmpleadoController);
router.post('/crear-orden', crearOrdenTrabajoController);

export default router;