import connection from '../database.js'

export const obtenerMantenimientos = () => {
  return new Promise((resolve, reject) => {
    const query = `
      select mantenimiento_equipos.mantenimiento_id, 
        mantenimiento_equipos.tipomantenimiento, 
        modelos_equipos.Nombre as nombre_equipo,
        mantenimiento_equipos.fecha_creacion,
        mantenimiento_equipos.Estado,
        mantenimiento_equipos.ubicacion,
        mantenimiento_equipos.descripcion,
        mantenimiento_equipos.observaciones,
        repuestos.Nombre as nombre_repuesto
      from mantenimiento_equipos 
        left join equipos on mantenimiento_equipos.Id_Equipo = equipos.Id_Equipo
        left join modelos_equipos on equipos.Id_Equipo = modelos_equipos.Id_Modelo
        left join repuestos on mantenimiento_equipos.Id_Repuesto = repuestos.Id_Repuesto
        `;
    
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
    const query = 'select modelos_equipos.Nombre from mantenimiento_equipos left join equipos on mantenimiento_equipos.Id_Equipo = equipos.Id_Equipo left join modelos_equipos on equipos.Id_Equipo = modelos_equipos.Id_Modelo';
    connection.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

export const obtenerRepuestos = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT nombre FROM repuestos';
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
        (descripcion,
        tipomantenimiento,
        fecha_creacion,
        estado,
        ubicacion,
        observaciones,
        Id_Equipo,
        Id_Repuesto
        )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      datos.descripcion,
      datos.tipomantenimiento,
      datos.fecha_creacion,
      datos.estado || 'Pendiente',
      datos.ubicacion,
      datos.observaciones,
      datos.Id_Equipo || null,
      datos.Id_Repuesto || null 
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
      if (error) return reject(error);
      resolve(results.affectedRows > 0);
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
      descripcion,
      tipomantenimiento,
      fecha_creacion,
      estado,
      ubicacion,
      observaciones,
      Id_Equipo,
      Id_Repuesto
    } = datos;

    const query = `
      UPDATE mantenimiento_equipos
      SET 
        descripcion = ?,
        tipomantenimiento = ?,
        fecha_creacion = ?,
        estado = ?,
        ubicacion = ?,
        observaciones = ?,
        Id_Equipo = ?
        Id_Repuesto = ?
      WHERE mantenimiento_id = ?
    `;

    connection.query(
      query,
      [descripcion, tipomantenimiento, fecha_creacion, fecha_creacion, estado, ubicacion, observaciones, Id_Equipo, Id_Repuesto, id],
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

export const obtenerOrdenesTrabajo = (prioridad = '') => {
  return new Promise((resolve, reject) => {
    let query = `
      select ordenes_trabajo.orden_id, 
        mantenimiento_equipos.mantenimiento_id,
        modelos_equipos.Nombre as nombre_equipo,
        empleados.nombre as personal,
        ordenes_trabajo.fecha_ejecucion,
        ordenes_trabajo.fecha_fin,
        ordenes_trabajo.prioridad from ordenes_trabajo
      left join mantenimiento_equipos ON ordenes_trabajo.mantenimiento_id = mantenimiento_equipos.mantenimiento_id
      left join empleados ON ordenes_trabajo.empleado_id = empleados.empleado_id
      left join equipos ON mantenimiento_equipos.Id_Equipo = equipos.Id_Equipo
      left join modelos_equipos ON equipos.Id_Equipo = modelos_equipos.Id_Modelo
    `;

    if (prioridad && ['Alta', 'Media', 'Baja'].includes(prioridad)) {
      query += ` WHERE ordenes_trabajo.prioridad = '${prioridad}'`;
    }

    query += ` ORDER BY ordenes_trabajo.fecha_ejecucion DESC`;

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


export const cambiarEstadoSolicitud = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE mantenimiento_equipos SET estado = ? WHERE mantenimiento_id = ?';
    const nuevoEstado = 'En proceso';

    connection.query(query, [nuevoEstado, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.affectedRows > 0);
    });
  });
};

export const cambiarEstadoEliminado = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE mantenimiento_equipos SET estado = ? WHERE mantenimiento_id = ?';
    const nuevoEstado = 'Eliminado';

    connection.query(query, [nuevoEstado, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.affectedRows > 0);
    });
  });
};

export const cambiarEstadoCompletado = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE mantenimiento_equipos SET estado = ? WHERE mantenimiento_id = ?';
    const nuevoEstado = 'Completado';

    connection.query(query, [nuevoEstado, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.affectedRows > 0);
    });
  });
};

export const cambiarPrioridadCompletado = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE ordenes_trabajo SET prioridad = ? WHERE orden_id = ?';
    const nuevoEstado = 'Completado';

    connection.query(query, [nuevoEstado, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.affectedRows > 0);
    });
  });
};