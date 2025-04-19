async function cargarTablaMantenimientos() {
  try {
    const response = await fetch('/mantenimiento');
    const mantenimientos = await response.json();

    const tbody = document.getElementById('data-container');
    tbody.innerHTML = mantenimientos.map(m => `
      <tr>
        <td>${m.mantenimiento_id}</td>
        <td>${m.tipomantenimiento}</td>
        <td>${m.nombre_equipo}</td>
        <td>${new Date(m.fecha_creacion).toLocaleDateString()}</td>
        <td>${m.descripcion}</td>
        <td><span class="badge ${m.estado === 'Completada' ? 'text-bg-success' : 'text-bg-secondary'} p-2">${m.estado}</span></td>
        <td>${m.campo || 'N/A'}</td>
        <td>${m.nombre_repuesto || 'N/A'}</td>
        <td class="actions">
          <a href="#" class="btn-eliminar" data-id="${m.mantenimiento_id}"><i class="fas fa-trash text-danger mx-1"></i></a>
          <a href="#" class="btn-editar" data-id="${m.mantenimiento_id}" data-bs-toggle="modal" data-bs-target="#modalEdicion"><i class="fas fa-pen text-warning mx-1"></i></a>
          <a href="#" class="btn-orden" data-id="${m.mantenimiento_id}" data-bs-toggle="modal" data-bs-target="#modalOrdenTrabajo"><i class="fas fa-file text-success mx-1"></i></a>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar mantenimientos:', error);
    alert('Error al cargar datos');
  }
}



async function cargarSelectEdicion(selectEquipos, selectRepuestos) {
  try {
    const response = await fetch('/datos-formulario');
    const { equipos, repuestos } = await response.json();

    const selectEquipo = document.getElementById(selectEquipos);
    selectEquipo.innerHTML = '<option value="">Seleccione un equipo</option>';
    equipos.forEach(equipo => {
      const option = document.createElement('option');
      option.value = equipo.equipo_id;
      option.textContent = equipo.nombre;
      selectEquipo.appendChild(option);
    });

    const selectRepuesto = document.getElementById(selectRepuestos);
    selectRepuesto.innerHTML = '<option value="">Seleccione un repuesto</option>';
    repuestos.forEach(repuesto => {
      const option = document.createElement('option');
      option.value = repuesto.repuesto_id;
      option.textContent = repuesto.nombre;
      selectRepuesto.appendChild(option);
    });

  } catch (error) {
    console.error('Error al cargar datos para formulario:', error);
  }
};

document.getElementById('btnOrdenMantenimiento').addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    const formData = {
      tipomantenimiento: document.getElementById('tipoMantenimiento').value,
      equipo_id: document.getElementById('selectEquipo').value,
      fecha_creacion: document.getElementById('fechaInicio').value,
      descripcion: document.getElementById('descripcion').value,
      estado: document.getElementById('estado').value,
      campo: document.getElementById('campo').value,
      repuesto_id: document.getElementById('selectRepuesto').value || null
    };

    const response = await fetch('/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
      alert('Mantenimiento registrado con éxito!');
      document.getElementById('formularioMantenimiento').reset();
      await cargarTablaMantenimientos();
    } else {
      throw new Error(result.error || 'Error desconocido');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al registrar el mantenimiento: ' + error.message);
  }
});

async function eliminarMantenimiento(boton) {
  const id = boton.getAttribute('data-id');
  if (!id) return;

  if (!confirm('¿Estás seguro de eliminar esta orden de mantenimiento? Al realizar esta accion las ordenes de trabajo derivadas de esta solicitud de servicio tambien seran eliminadas.')) {
    return;
  }

  try {
    const response = await fetch(`/eliminar/${id}`, {
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
}

async function cargarEdicion(mantenimientoId) {
  try {
    const response = await fetch(`/actualizar/${mantenimientoId}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Datos de mantenimiento:', data);
    
    if (!data || !data.mantenimiento_id) {
      throw new Error('Datos de mantenimiento no válidos');
    }

    document.getElementById('mantenimientoIdEdicion').value = data.mantenimiento_id;
    document.getElementById('tipoMantenimientoEdicion').value = data.tipomantenimiento;
    document.getElementById('fechaInicioEdicion').value = data.fecha_creacion;
    document.getElementById('estadoEdicion').value = data.estado;
    document.getElementById('descripcionEdicion').value = data.descripcion;
    document.getElementById('campoEdicion').value = data.campo;
    await cargarSelectEdicion('selectEquipoEdicion', 'selectRepuestoEdicion');
    document.getElementById('selectEquipoEdicion').value = data.equipo_id;
    document.getElementById('selectRepuestoEdicion').value = data.repuesto_id;
    
  } catch (error) {
    console.error('Error al cargar datos:', error);
    alert('Error al cargar datos: ' + error.message);
  }
};

document.getElementById('btnActualizarMantenimiento').addEventListener('click', async (e) => {
  e.preventDefault();
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

    const response = await fetch(`/enviar/${mantenimientoId}`, {
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
        const response = await fetch(`/actualizar/${mantenimientoId}`);
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
    const response = await fetch('/obtenerOrdenesTrabajo');
    const resultado = await response.json();
    const ordenes = resultado.data;

    const tbody = document.getElementById('datos-ordenes-trabajo');
    tbody.innerHTML = ordenes.map(orden => `
      <tr>
        <td>${orden.orden_id}</td>
        <td>${orden.mantenimiento}</td>
        <td>${orden.personal}</td>
        <td>${new Date(orden.fecha_ejecucion).toLocaleDateString()}</td>
        <td>${new Date(orden.fecha_fin).toLocaleDateString()}</td>
        <td>
          <span class="badge ${
            orden.prioridad === 'Alta' ? 'text-bg-danger' :
            orden.prioridad === 'Media' ? 'text-bg-warning' :
            'text-bg-info'
          } p-2">${orden.prioridad}</span>
        </td>
        <td>
          <a href="#" class="btn-eliminarTrabajo" data-id="${orden.orden_id}"><i class="fas fa-trash text-danger mx-1"></i></a>
          <a href="#" class="btn-reporte" data-id="${orden.orden_id}" data-bs-toggle="modal" data-bs-target="#modalReporte"><i class="fas fa-check text-success mx-1"></i></a>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar mantenimientos:', error);
    alert('Error al cargar datos');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnOrdenTrabajo').addEventListener('click', async () => {
    const mantenimiento_id = document.getElementById('mantenimientoIdEdicion').value;
    const empleado_id = document.getElementById('personalMantenimiento').value;
    const fecha_ejecucion = document.getElementById('fechaInicioTrabajo').value;
    const fecha_fin = document.getElementById('fechaFinTrabajo').value;
    const prioridad = document.getElementById('prioridadTrabajo').value;
    const datos = {
      mantenimiento_id,
      empleado_id,
      fecha_ejecucion,
      fecha_fin,
      prioridad
    };

    const response = await fetch('/crear-orden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const result = await response.json();
    await cargarOrdenesTrabajo();

    if (response.ok) {
      alert('¡Orden de trabajo generada correctamente!');
      bootstrap.Modal.getInstance(document.getElementById('modalOrdenTrabajo')).hide();
      await cargarTablaOrdenes();
    } else {
      alert(`Error: ${result.error}`);
    }
  });
});

async function selectEmpleadosOrden() {
  try {
    const response = await fetch('/empleado-orden');
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

document.getElementById('btnOrdenTrabajo').addEventListener('click', async () => {
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
    const response = await fetch('/crear-orden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    const result = await response.json();
    await cargarOrdenesTrabajo();

    if (result.success) {
      alert('Orden de trabajo creada exitosamente');
      $('#modalOrdenTrabajo').modal('hide');
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
  if (!id) return;

  if (!confirm('¿Estás seguro de eliminar esta orden de trabajo?')) {
    return;
  }

  try {
    const response = await fetch(`/eliminarOrdenTrabajo/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    await cargarOrdenesTrabajo();

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