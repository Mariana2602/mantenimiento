import { obtenerEquipos } from "../models/equipoMantenimientoModel.js";

export const listarEquipos = async (req, res) => {
  try {
    const equipos = await obtenerEquipos();
    if (!Array.isArray(equipos)) {
      throw new Error('La respuesta no es un array válido');
    }
    
    res.json(equipos);
    
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Error al obtener datos',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};