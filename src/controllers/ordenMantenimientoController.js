import connection from "../database.js";
import { obtenerMantenimientos, 
         obtenerEquipos, 
         obtenerRepuestos, 
         crearOrdenMantenimiento, 
         eliminarOrdenMantenimiento, 
         obtenerIdEdicion,
         actualizarMantenimiento,
         crearOrdenTrabajo,
         obtenerEmpleado } 
         from "../models/ordenMantenimientoModel.js";

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
    const { 
      tipomantenimiento, 
      equipo_id, 
      fecha_creacion, 
      descripcion, 
      estado, 
      campo, 
      repuesto_id 
    } = req.body;

    const datosMantenimiento = {
      tipomantenimiento,
      equipo_id: parseInt(equipo_id),
      fecha_creacion: new Date(fecha_creacion).toISOString().slice(0, 19).replace('T', ' '),
      descripcion,
      estado,
      campo,
      repuesto_id: repuesto_id ? parseInt(repuesto_id) : null
    };

    const mantenimientoId = await crearOrdenMantenimiento(datosMantenimiento);

    res.status(201).json({
      success: true,
      message: 'Mantenimiento registrado correctamente',
      mantenimiento_id: mantenimientoId
    });

  } catch (error) {
    console.error('Error al registrar mantenimiento:', error);
    res.status(500).json({
      success: false,
      error: 'Error al registrar el mantenimiento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const eliminarMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await eliminarOrdenMantenimiento(id);
    
    if (!eliminado) {
      return res.status(404).json({ 
        success: false, 
        error: 'Mantenimiento no encontrado' 
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error al eliminar mantenimiento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    console.log('Resultado de la actualización:', result);  // Ver qué devuelve la función de actualización
    
    if (result.success) {
      return res.status(200).json(result);  // Si la actualización fue exitosa
    } else {
      throw new Error('La actualización no se realizó correctamente'); // Si no fue exitosa
    }
  } catch (error) {
    console.error('Error al actualizar el mantenimiento:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const crearOr = async (req, res) => {
  try {
    const datos = req.body;
    const resultado = await crearOrdenTrabajo(datos);

    const updateQuery = `UPDATE mantenimiento_equipos SET estado = 'En proceso' WHERE mantenimiento_id = ?`;
    connection.query(updateQuery, [datos.mantenimiento_id], (error) => {
      if (error) {
        console.error('Error al actualizar el estado del mantenimiento:', error);
      }
    });

    res.status(201).json({ message: 'Orden de trabajo creada exitosamente', ordenId: resultado.insertId });
  } catch (err) {
    console.error('Error al crear orden de trabajo:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const crearOrdenTrabajoController = async (req, res) => {
  try {
    const datos = req.body;
    const ordenId = await crearOrdenTrabajo(datos);
    res.json({ success: true, ordenId });
    
  } catch (error) {
    console.error('Error al crear la orden de trabajo:', error);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};