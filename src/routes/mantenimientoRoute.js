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
         eliminarOrdenTrabajoController,
         cambiarEstadoSolicitudController,
         cambiarEstadoEliminadoController,
         cambiarEstadoCompletadoController,
         cambiarPrioridadController} from '../controllers/mantenimientoController.js';

const router = Router();

router.get('/lista', listarMantenimientos);
router.get('/datos-formulario', obtenerEquiposRepuestos);
router.post('/registro', registrarMantenimiento);
router.delete('/eliminar/:id', eliminarMantenimiento);
router.get('/actualizar/:id', obtenerMantenimientoEdicion);
router.put('/enviar/:id', actualizarMantenimientoController);
router.get('/empleado-orden', obtenerEmpleadoController);
router.post('/crear-orden', crearOrdenTrabajoController);
router.get('/obtenerOrdenesTrabajo/:prioridad?', ordenesTrabajoController);
router.delete('/eliminarOrdenTrabajo/:id', eliminarOrdenTrabajoController);
router.put('/solicitudes/estado/:id', cambiarEstadoSolicitudController);
router.put('/solicitudes/eliminado/:id', cambiarEstadoEliminadoController);
router.put('/solicitudes/completado/:id', cambiarEstadoCompletadoController);
router.put('/prioridad/:id', cambiarPrioridadController);

export default router;