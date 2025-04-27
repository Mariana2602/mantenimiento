async function cargarTablaMantenimientos() {
  try {
    const response = await fetch('/mantenimiento/lista');
    const mantenimientos = await response.json();

    const tbody = document.getElementById('data-container');
    tbody.innerHTML = mantenimientos.map(m => `
      <tr id="mantenimiento-row-${m.mantenimiento_id}">
        <td>${m.mantenimiento_id}</td>
        <td>${m.tipomantenimiento}</td>
        <td>${m.descripcion}</td>
        <td>${m.ubicacion}</td>
        <td>${new Date(m.fecha_creacion).toLocaleDateString()}</td>
        <td>${m.nombre_equipo || 'Sin especificar'}</td>
        <td>
          <span class="badge ${
            m.Estado === 'Eliminado' ? 'text-bg-danger' :
            m.Estado === 'En proceso' ? 'text-bg-warning' :
            m.Estado === 'Completado' ? 'text-bg-success' :
            'text-bg-secondary'
          } p-2">${m.Estado}</span>
        </td>
        <td>${m.nombre_repuesto || 'Sin especificar'}</td>
        <td class="actions" id="acciones-${m.mantenimiento_id}">
          ${m.Estado === 'Eliminado' ? `
            <a href="#" class="btn-eliminar" data-id="${m.mantenimiento_id}"><i class="fas fa-trash text-danger mx-1"></i></a>
          ` : ''}
          ${m.Estado !== 'Completado' && m.Estado !== 'Eliminado' && m.Estado !== 'En proceso' ? `
            <a href="#" class="btn-editar" data-id="${m.mantenimiento_id}" data-bs-toggle="modal" data-bs-target="#modalEdicion"><i class="fas fa-pen text-warning mx-1"></i></a>
            <a href="#" class="btn-eliminar" data-id="${m.mantenimiento_id}"><i class="fas fa-trash text-danger mx-1"></i></a>
            <a href="#" class="btn-orden" data-id="${m.mantenimiento_id}" data-bs-toggle="modal" data-bs-target="#modalOrdenTrabajo"><i class="fas fa-file text-success mx-1"></i></a>
          ` : ''}
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar mantenimientos:', error);
    alert('Error al cargar datos');
  }
};

async function cargarSelectEdicion(selectEquipos, selectRepuestos) {
  try {
    const response = await fetch('/mantenimiento/datos-formulario');
    const { equipos, repuestos } = await response.json();

    const selectEquipo = document.getElementById(selectEquipos);
    selectEquipo.innerHTML = '<option value="">Seleccione un equipo</option>';
    equipos.forEach(equipo => {
      const option = document.createElement('option');
      option.value = equipo.Id_Equipo;
      option.textContent = equipo.Nombre;
      selectEquipo.appendChild(option);
    });

    const selectRepuesto = document.getElementById(selectRepuestos);
    selectRepuesto.innerHTML = '<option value="">Seleccione un repuesto</option>';
    repuestos.forEach(repuesto => {
      const option = document.createElement('option');
      option.value = repuesto.Id_Repuesto;
      option.textContent = repuesto.nombre;
      selectRepuesto.appendChild(option);
    });

  } catch (error) {
    console.error('Error al cargar datos para formulario:', error);
  }
};

document.getElementById('btnOrdenMantenimiento').addEventListener('click', async (e) => {
  e.preventDefault();
  const form = document.getElementById('formularioMantenimiento');
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  try {
    const getValue = (id) => {
      const element = document.getElementById(id);
      if (!element) {
        console.error(`Elemento con ID ${id} no encontrado`);
        return null;
      }
      return element.value || null;
    };

    const formData = {
      descripcion: getValue('descripcion'),
      tipomantenimiento: getValue('tipoMantenimiento'),
      fecha_creacion: getValue('fechaInicio'),
      estado: getValue('estado'),
      ubicacion: getValue('ubicacion'),
      observaciones: getValue('observaciones'),
      Id_Equipo: getValue('selectEquipo') ? parseInt(getValue('selectEquipo')) : null,
      Id_Repuesto: getValue('selectRepuesto') ? parseInt(getValue('selectRepuesto')) : null
    };

    console.log('Datos a enviar:', formData); 
    const response = await fetch('/mantenimiento/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    console.log('Respuesta del servidor:', response); 

    const result = await response.json();
    console.log('Resultado:', result); 

    if (result.success) {
      alert('Mantenimiento registrado con éxito!');
      form.reset();
      await cargarTablaMantenimientos();
    } else {
      throw new Error(result.error || 'Error desconocido');
    }
  } catch (error) {
    console.error('Error completo:', error); 
    alert('Error al registrar el mantenimiento: ' + error.message);
  }
});

async function eliminarMantenimiento(boton) {
  const id = boton.getAttribute('data-id');
  if (!id) return;

  if (!confirm('¿Estás seguro de eliminar esta orden de mantenimiento?')) {
    return;
  }

  try {
    const response = await fetch(`/mantenimiento/eliminar/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      alert('Orden eliminada correctamente');
      boton.closest('tr').remove();
    } else {
      throw new Error(result.error || 'Error al eliminar');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar la orden: ' + error.message);
  }
};

async function cargarEdicion(mantenimientoId) {
  try {
    const response = await fetch(`/mantenimiento/actualizar/${mantenimientoId}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Datos de mantenimiento:', data);
    
    if (!data || !data.mantenimiento_id) {
      throw new Error('Datos de mantenimiento no válidos');
    }

    document.getElementById('mantenimientoIdEdicion').value = data.mantenimiento_id;
    document.getElementById('descripcionEdicion').value = data.descripcion;
    document.getElementById('tipoMantenimientoEdicion').value = data.tipomantenimiento;
    document.getElementById('fechaInicioEdicion').value = data.fecha_creacion.split('T')[0];
    document.getElementById('estadoEdicion').value = data.estado;
    document.getElementById('ubicacionEdicion').value = data.ubicacion;
    document.getElementById('observacionesEdicion').value = data.observaciones;
    await cargarSelectEdicion('selectEquipoEdicion', 'selectRepuestoEdicion');
    document.getElementById('selectEquipoEdicion').value = data.Id_Equipo;
    document.getElementById('selectRepuestoEdicion').value = data.Id_Repuesto;
    
  } catch (error) {
    console.error('Error al cargar datos:', error);
    alert('Error al cargar datos: ' + error.message);
  }
};

document.getElementById('btnActualizarMantenimiento').addEventListener('click', async (e) => {
  e.preventDefault();
  const form = document.getElementById('formularioEdicion');
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }
  try {
    const mantenimientoId = document.getElementById('mantenimientoIdEdicion').value;

    const formData = {
      tipomantenimiento: document.getElementById('tipoMantenimientoEdicion').value,
      equipo_id: document.getElementById('selectEquipoEdicion').value || null,
      fecha_creacion: document.getElementById('fechaInicioEdicion').value || null,
      descripcion: document.getElementById('descripcionEdicion').value,
      estado: document.getElementById('estadoEdicion').value,
      campo: document.getElementById('campoEdicion').value,
      repuesto_id: document.getElementById('selectRepuestoEdicion').value || null
    };

    const response = await fetch(`/mantenimiento/enviar/${mantenimientoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const result = await response.json();

    if (response.ok) {
      alert('¡Éxito! Los cambios han sido guardados correctamente.');
      bootstrap.Modal.getInstance(document.getElementById('modalEdicion')).hide();
      await cargarTablaMantenimientos();
    } else {
      alert(`Error: ${result.error || 'No se pudieron guardar los cambios'}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  }
});

document.addEventListener('click', async (e) => {
  if (e.target.matches('.btn-editar') || e.target.closest('.btn-editar')) {
    const btn = e.target.closest('.btn-editar');
    const mantenimientoId = btn.getAttribute('data-id');
    console.log('ID del mantenimiento seleccionado:', mantenimientoId);
  
    if (mantenimientoId) {
      await cargarEdicion(mantenimientoId);
    }
  }

  if (e.target.matches('.btn-orden') || e.target.closest('.btn-orden')) {
    const btn = e.target.closest('.btn-orden');
    const mantenimientoId = btn.getAttribute('data-id');
    console.log('ID del mantenimiento seleccionado para orden:', mantenimientoId);
  
    if (mantenimientoId) {
      try {
        const response = await fetch(`/mantenimiento/actualizar/${mantenimientoId}`);
        const data = await response.json();
  
        document.getElementById('mantenimientoIdOrden').value = data.mantenimiento_id;
        document.getElementById('tipoMantenimientoOrden').value = data.tipomantenimiento;
        document.getElementById('fechaInicioOrden').value = data.fecha_creacion;
        document.getElementById('estadoOrden').value = data.estado;
        document.getElementById('descripcionOrden').value = data.descripcion;
        document.getElementById('campoOrden').value = data.campo;
        await cargarSelectEdicion('selectEquipoOrden', 'selectRepuestoOrden');
        document.getElementById('selectEquipoOrden').value = data.equipo_id;
        document.getElementById('selectRepuestoOrden').value = data.repuesto_id;
  
      } catch (error) {
        console.error('Error al cargar datos en modal de orden:', error);
        alert('No se pudo cargar los datos para la orden de trabajo');
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await cargarTablaMantenimientos();
  await cargarSelectEdicion('selectEquipo', 'selectRepuesto');
  await selectEmpleadosOrden();
  await cargarOrdenesTrabajo();

  document.getElementById('datos-ordenes-trabajo').addEventListener('click', (e) => {
    const boton = e.target.closest('.btn-eliminarTrabajo');
    console.log(boton);
    if (!boton) return;
    eliminarOrdenTrabajo(boton);
  });

  document.getElementById('datos-ordenes-trabajo').addEventListener('click', (e) => {
    const boton = e.target.closest('.btn-completar');
    console.log(boton);
    if (!boton) return;
    completarOrdenTrabajo(boton);
  });

  document.getElementById('data-container').addEventListener('click', (e) => {
    const boton = e.target.closest('.btn-eliminar');
    console.log(boton);
    if (!boton) return;
    eliminarMantenimiento(boton);
  });

});

// ORDENES DE TRABAJO

async function cargarOrdenesTrabajo() {
  try {
    const response = await fetch('/mantenimiento/obtenerOrdenesTrabajo');
    const resultado = await response.json();
    const ordenes = resultado.data;

    const tbody = document.getElementById('datos-ordenes-trabajo');
    tbody.innerHTML = ordenes.map(orden => `
      <tr>
        <td>${orden.orden_id}</td>
        <td>${orden.nombre_equipo}</td>
        <td>${orden.personal}</td>
        <td>${new Date(orden.fecha_ejecucion).toLocaleDateString()}</td>
        <td>${new Date(orden.fecha_fin).toLocaleDateString()}</td>
        <td>
          <span class="badge ${
            orden.prioridad === 'Completado' ? 'text-bg-success' :
            orden.prioridad === 'Alta' ? 'text-bg-danger' :
            orden.prioridad === 'Media' ? 'text-bg-warning' :
            'text-bg-info'
          } p-2">${orden.prioridad}</span>
        </td>
        <td>
          ${orden.prioridad === 'Completado' ? `
            <span class="badge text-bg-success p-2">Completado</span>
          ` : `
            <a href="#" class="btn-eliminarTrabajo" data-id="${orden.orden_id}" data-mantenimiento="${orden.mantenimiento_id}"><i class="fas fa-trash text-danger mx-1"></i></a>
            <a href="#" class="btn-completar" data-id="${orden.orden_id}" data-mantenimiento="${orden.mantenimiento_id}"><i class="fas fa-check text-success mx-1"></i></a>
          `}
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar mantenimientos:', error);
    alert('Error al cargar datos');
  }
};

async function selectEmpleadosOrden() {
  try {
    const response = await fetch('/mantenimiento/empleado-orden');
    const empleado = await response.json();

    const selectEmpleado = document.getElementById('selectPersonalMantenimiento');
    selectEmpleado.innerHTML = '<option value="">Seleccione un empleado</option>';
    empleado.forEach(empleados => {
      const option = document.createElement('option');
      option.value = empleados.empleado_id;
      option.textContent = empleados.nombre;
      selectEmpleado.appendChild(option);
    });

  } catch (error) {
    console.error('Error al cargar datos para formulario:', error);
  }
};

document.getElementById('btnOrdenTrabajo').addEventListener('click', async (e) => {
  e.preventDefault();
  const form = document.getElementById('formOrdenTrabajo');
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const mantenimientoId = document.getElementById('mantenimientoIdOrden').value;
  const empleadoId = document.getElementById('selectPersonalMantenimiento').value;
  const fechaEjecucion = document.getElementById('fechaInicioTrabajo').value;
  const fechaFin = document.getElementById('fechaFinTrabajo').value;
  const prioridad = document.getElementById('prioridadTrabajo').value;

  const datos = {
    mantenimiento_id: mantenimientoId,
    empleado_id: empleadoId,
    fecha_ejecucion: fechaEjecucion,
    fecha_fin: fechaFin,
    prioridad: prioridad
  };

  try {
    const response = await fetch('/mantenimiento/crear-orden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    const result = await response.json();
    if (result.success) {
      const estadoRes = await fetch(`/mantenimiento/solicitudes/estado/${mantenimientoId}`, {
        method: 'PUT'
      });

      const estadoResult = await estadoRes.json();
      
      if (!estadoResult.success) {
        console.warn('No se pudo cambiar el estado:', estadoResult.error);
        alert('No se pudo cambiar el estado a "En proceso"');
        return; 
      }
      const accionesTd = document.getElementById(`acciones-${mantenimientoId}`);
      if (accionesTd) {
        accionesTd.innerHTML = ''; 
      }
      alert('Orden de trabajo creada exitosamente');
      $('#modalOrdenTrabajo').modal('hide');
      await cargarOrdenesTrabajo(); 
      await cargarTablaMantenimientos();

    } else {
      alert('Error al crear orden: ' + result.error);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    alert('Ocurrió un error al enviar la orden');
  }
});

async function eliminarOrdenTrabajo(boton) {
  const id = boton.getAttribute('data-id'); 
  const mantenimientoId = boton.getAttribute('data-mantenimiento');
  console.log(mantenimientoId); 

  if (!id || !mantenimientoId) return;

  if (!confirm('¿Estás seguro de eliminar esta orden de trabajo?')) {
    return;
  }

  try {
    const estadoRes = await fetch(`/mantenimiento/solicitudes/eliminado/${mantenimientoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const estadoResult = await estadoRes.json();
    if (!estadoResult.success) {
      throw new Error('No se pudo cambiar el estado: ' + estadoResult.error);
    }

    const deleteRes = await fetch(`/mantenimiento/eliminarOrdenTrabajo/${id}`, {
      method: 'DELETE'
    });

    const deleteResult = await deleteRes.json();

    await cargarOrdenesTrabajo();
    await cargarTablaMantenimientos();

    if (deleteResult.success) {
      alert('Orden eliminada correctamente');
      boton.closest('tr').remove();
    } else {
      throw new Error(deleteResult.error || 'Error al eliminar la orden');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar la orden: ' + error.message);
  }
};

async function completarOrdenTrabajo(boton) {
  const mantenimientoId = boton.getAttribute('data-mantenimiento');
  const ordenId = boton.getAttribute('data-id'); 

  const confirmacion = confirm('¿Estás seguro de que quieres marcar esta orden como completada?');
  if (!confirmacion) return;

  try {
    const res = await fetch(`/mantenimiento/solicitudes/completado/${mantenimientoId}`, {
      method: 'PUT'
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error('No se pudo cambiar el estado: ' + estadoResult.error);
    }

    const pri = await fetch(`/mantenimiento/prioridad/${ordenId}`, {
      method: 'PUT'
    });

    const prioridad = await pri.json();

    await cargarOrdenesTrabajo();
    await cargarTablaMantenimientos();

    if (prioridad.success) {
      alert('Orden completada correctamente');
      boton.closest('tr').remove();
    } else {
      throw new Error(prioridad.error || 'Error al eliminar la orden');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar la orden: ' + error.message);
  }
};

// ----------------------------------

document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
  btn.addEventListener('click', function () {
    const targetId = this.getAttribute('data-bs-target') || this.getAttribute('href');
    
    document.querySelectorAll('.collapse').forEach(collapse => {
      if (!collapse.classList.contains('show') || collapse.id === targetId.replace('#', '')) return;

      const collapseInstance = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse, { toggle: false });
      collapseInstance.hide();
    });
  });
});

document.getElementById('btnCargarReportes').addEventListener('click', async () => {
  const desde = document.getElementById('desde').value;
  const hasta = document.getElementById('hasta').value;
  const estado = document.getElementById('estado').value;
  const tipo = document.getElementById('tipo').value;

  try {
    const res = await fetch('/reportesFiltrados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        desde,
        hasta,
        estado,
        tipo
      })
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.error);

    const reportes = data.reportes;
    const tbody = document.getElementById('datosReportes');
    tbody.innerHTML = reportes.map(reporte => `
      <tr>
        <td>${reporte.mantenimiento_id}</td>
        <td>${reporte.tipomantenimiento}</td>
        <td>${new Date(reporte.fecha_creacion).toLocaleDateString()}</td>
        <td>${new Date(reporte.fecha_ejecucion).toLocaleDateString()}</td>
        <td>${new Date(reporte.fecha_fin).toLocaleDateString()}</td>
        <td>${reporte.estado}</td>
        <td>${reporte.equipo_nombre}</td>
        <td>
          <button class="btn btn-info">Ver reporte</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error al cargar reportes:', error);
    alert('Ocurrió un error al cargar los reportes');
  }
});
