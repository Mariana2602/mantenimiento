import { Router } from 'express';
import { listarMantenimientos, 
         obtenerEquiposRepuestos, 
         registrarMantenimiento, 
         eliminarMantenimiento, 
         obtenerMantenimientoEdicion, 
         actualizarMantenimientoController,
         crearOrdenTrabajoController,
         obtenerEmpleadoController,
         ordenesTrabajoController,
         eliminarOrdenTrabajoController} from '../controllers/ordenMantenimientoController.js';

const router = Router();

router.get('/mantenimiento', listarMantenimientos);
router.get('/datos-formulario', obtenerEquiposRepuestos);
router.post('/registro', registrarMantenimiento);
router.delete('/eliminar/:id', eliminarMantenimiento);
router.get('/actualizar/:id', obtenerMantenimientoEdicion);
router.put('/enviar/:id', actualizarMantenimientoController);
router.get('/empleado-orden', obtenerEmpleadoController);
router.post('/crear-orden', crearOrdenTrabajoController);
router.get('/obtenerOrdenesTrabajo', ordenesTrabajoController);
router.delete('/eliminarOrdenTrabajo/:id', eliminarOrdenTrabajoController);

export default router;