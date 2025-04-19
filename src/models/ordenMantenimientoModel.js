import connection from '../database.js'

export const obtenerMantenimientos = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        m.mantenimiento_id, 
        m.tipomantenimiento, 
        e.nombre as nombre_equipo, 
        m.fecha_creacion, 
        m.descripcion, 
        m.estado,
        m.campo, 
        r.nombre as nombre_repuesto 
      FROM mantenimiento_equipos m 
        LEFT JOIN equipos e ON m.equipo_id = e.equipo_id 
        LEFT JOIN repuestos r ON m.repuesto_id = r.repuesto_id 
      ORDER BY m.fecha_creacion DESC`;
    
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

export const obtenerEquipos = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT equipo_id, nombre FROM equipos';
    connection.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

export const obtenerRepuestos = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT repuesto_id, nombre FROM repuestos';
    connection.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

export const crearOrdenMantenimiento = (datos) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO mantenimiento_equipos 
        (tipomantenimiento, 
        equipo_id, 
        fecha_creacion, 
        descripcion, 
        estado, 
        campo, 
        repuesto_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      datos.tipomantenimiento,
      datos.equipo_id,
      datos.fecha_creacion,
      datos.descripcion,
      datos.estado || 'Pendiente',
      datos.campo,
      datos.repuesto_id || null 
    ];

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results.insertId);
    });
  });
};

export const eliminarOrdenMantenimiento = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM mantenimiento_equipos WHERE mantenimiento_id = ?';
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error SQL al eliminar mantenimiento:', error);
        return reject(new Error('No se pudo eliminar. Verifica dependencias o el ID.'));
      }

      if (results.affectedRows === 0) {
        return reject(new Error('No se encontró mantenimiento con ese ID.'));
      }

      resolve(true);
    });
  });
};

export const obtenerIdEdicion = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM mantenimiento_equipos WHERE mantenimiento_id = ?`;
    connection.query(query, [id], (error, results) => {
      if (error) return reject(error);
      if (results.length === 0) return reject(new Error('Mantenimiento no encontrado'));
      resolve(results[0]);
    });
  });
};

export const actualizarMantenimiento = (id, datos) => {
  return new Promise((resolve, reject) => {
    const {
      tipomantenimiento,
      equipo_id,
      fecha_creacion,
      descripcion,
      estado,
      campo,
      repuesto_id
    } = datos;

    const query = `
      UPDATE mantenimiento_equipos
      SET 
        tipomantenimiento = ?,
        equipo_id = ?,
        fecha_creacion = ?,
        descripcion = ?,
        estado = ?,
        campo = ?,
        repuesto_id = ?
      WHERE mantenimiento_id = ?
    `;

    connection.query(
      query,
      [tipomantenimiento, equipo_id, fecha_creacion, descripcion, estado, campo, repuesto_id, id],
      (error, results) => {
        if (error) {
          console.error('Error en la consulta SQL:', error);
          return reject(error);
        }
        if (results.affectedRows === 0) {
          console.log('No se encontró el mantenimiento con ID:', id);
          return reject(new Error('Mantenimiento no encontrado o no actualizado'));
        }
        resolve({ success: true, updated: results });
      }
    );
  });
};


// TABLA DE ORDENES DE TRABAJO

export const obtenerOrdenesTrabajo = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ot.orden_id,
        eq.nombre AS mantenimiento,
        e.nombre AS personal,
        ot.fecha_ejecucion,
        ot.fecha_fin,
        ot.prioridad
      FROM ordenes_trabajo ot 
      LEFT JOIN mantenimiento_equipos me ON ot.mantenimiento_id = me.mantenimiento_id
      LEFT JOIN empleados e ON ot.empleado_id = e.empleado_id
      LEFT JOIN equipos eq ON me.equipo_id = eq.equipo_id
      ORDER BY ot.fecha_ejecucion DESC
    `;
    
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error en la consulta SQL:', error);
        return reject({
          message: 'Error al obtener órdenes de trabajo',
          status: 500,
          sqlError: error.message
        });
      }
      resolve(results || []);
    });
  });
};

export const crearOrdenTrabajo = (datos) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO ordenes_trabajo (mantenimiento_id, empleado_id, fecha_ejecucion, fecha_fin, prioridad)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      datos.mantenimiento_id,
      datos.empleado_id,
      datos.fecha_ejecucion,
      datos.fecha_fin,
      datos.prioridad || 'En proceso',
    ];

    connection.query(query, values, (error, results) => {
      if (error) return reject(error);
      resolve(results.insertId);
    });
  });
};

export const obtenerEmpleado = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT empleado_id, nombre FROM empleados';
    connection.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

export const eliminarOrdenTrabajo = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM ordenes_trabajo WHERE orden_id = ?';
    connection.query(query, [id], (error, results) => {
      if (error) return reject(error);
      resolve(results.affectedRows > 0);
    });
  });
};