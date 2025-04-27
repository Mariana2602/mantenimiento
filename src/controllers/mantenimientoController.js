import { obtenerMantenimientos, 
         obtenerEquipos, 
         obtenerRepuestos, 
         crearOrdenMantenimiento, 
         eliminarOrdenMantenimiento, 
         obtenerIdEdicion,
         actualizarMantenimiento,
         crearOrdenTrabajo,
         obtenerEmpleado,
         obtenerOrdenesTrabajo, 
         eliminarOrdenTrabajo,
         cambiarEstadoSolicitud,
         cambiarEstadoEliminado,
         cambiarEstadoCompletado,
         cambiarPrioridadCompletado} 
         from "../models/mantenimientoModel.js";

export const listarMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await obtenerMantenimientos();
    if (!Array.isArray(mantenimientos)) {
      throw new Error('La respuesta no es un array válido');
    }
    
    res.json(mantenimientos);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Error al obtener datos',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const obtenerEmpleadoController = async (req, res) => {
  try {
    const empleado = await obtenerEmpleado();
    res.json(empleado);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener nombre del empleado'
    });
  }
};

export const obtenerEquiposRepuestos = async (req, res) => {
  try {
    const [equipos, repuestos] = await Promise.all([
      obtenerEquipos(),
      obtenerRepuestos()
    ]);
    res.json({
      equipos,
      repuestos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos para formulario'
    });
  }
};

export const registrarMantenimiento = async (req, res) => {
  try {
    const { body } = req;
    let fechaFormateada;
    try {
      fechaFormateada = body.fecha_creacion 
        ? new Date(body.fecha_creacion).toISOString().slice(0, 19).replace('T', ' ')
        : new Date().toISOString().slice(0, 19).replace('T', ' ');
    } catch (e) {
      fechaFormateada = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    const datosMantenimiento = {
      descripcion: body.descripcion,
      tipomantenimiento: body.tipomantenimiento,
      fecha_creacion: fechaFormateada,
      estado: body.estado || 'Pendiente',
      ubicacion: body.ubicacion || null,
      observaciones: body.observaciones || null,
      Id_Equipo: body.Id_Equipo ? parseInt(body.Id_Equipo) : null,
      Id_Repuesto: body.Id_Repuesto ? parseInt(body.Id_Repuesto) : null
    };

    console.log('Datos a insertar:', datosMantenimiento); // Log para depuración

    const mantenimientoId = await crearOrdenMantenimiento(datosMantenimiento);

    res.status(201).json({
      success: true,
      message: 'Mantenimiento registrado correctamente',
      mantenimiento_id: mantenimientoId
    });

  } catch (error) {
    console.error('Error detallado al registrar mantenimiento:', {
      message: error.message,
      stack: error.stack,
      sqlError: error.sqlMessage || 'No es error de SQL'
    });
    
    res.status(500).json({
      success: false,
      error: 'Error al registrar el mantenimiento',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        sqlError: error.sqlMessage
      } : undefined
    });
  }
};

export const eliminarMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarOrdenMantenimiento(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar la orden' });
  }
};

export const obtenerMantenimientoEdicion = async (req, res) => {
  try {
    const { id } = req.params;
    const mantenimiento = await obtenerIdEdicion(id);

    res.json(mantenimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error al cargar los datos del mantenimiento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const actualizarMantenimientoController = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;

  console.log('Datos recibidos para actualización:', datos);

  try {
    const result = await actualizarMantenimiento(id, datos);
    console.log('Resultado de la actualización:', result); 
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      throw new Error('La actualización no se realizó correctamente'); 
    }
  } catch (error) {
    console.error('Error al actualizar el mantenimiento:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ORDENES DE TRABAJO

export const crearOrdenTrabajoController = async (req, res) => {
  try {
    const datos = req.body;
    console.log('Datos recibidos para crear orden:', datos);
    const ordenId = await crearOrdenTrabajo(datos);
    res.json({ success: true, ordenId });
    
  } catch (error) {
    console.error('Error al crear la orden de trabajo:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

export const ordenesTrabajoController = async (req, res) => {
  try {
    const prioridad = req.params.prioridad || '';
    const ordenes = await obtenerOrdenesTrabajo(prioridad);
    res.status(200).json({
      success: true,
      data: ordenes
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al obtener las órdenes de trabajo',
      error: error.sqlError || null
    });
  }
};

export const eliminarOrdenTrabajoController = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarOrdenTrabajo(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar la orden' });
  }
};

export const cambiarEstadoSolicitudController = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await cambiarEstadoSolicitud(id);

    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
};

export const cambiarEstadoEliminadoController = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await cambiarEstadoEliminado(id);

    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
};

export const cambiarEstadoCompletadoController = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await cambiarEstadoCompletado(id);

    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
};

export const cambiarPrioridadController = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await cambiarPrioridadCompletado(id);

    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
};
