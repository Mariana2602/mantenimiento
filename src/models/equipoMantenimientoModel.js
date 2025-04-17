import connection from '../database.js'

export const obtenerEquipos = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT equipo_id, nombre, descripcion, fecha_instalacion, estado, frecuencia_mantenimiento, ifnull(modelo_id, "Sin registro") as modelo_id, ifnull(ubicacion_id, "Sin registro") as ubicacion_id from equipos`;
    
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error en la consulta SQL:', error);
        return reject({
          message: 'Error al obtener mantenimientos',
          status: 500,
          sqlError: error.message
        });
      }
      resolve(results || []); 
    });
  });
};