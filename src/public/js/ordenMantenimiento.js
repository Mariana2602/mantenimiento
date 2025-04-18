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
          <a href="#" class="btn-editar" data-id="${m.mantenimiento_id}" data-bs-toggle="modal" data-bs-target="#modalOrdenTrabajo"><i class="fas fa-check text-success mx-1"></i></a>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar mantenimientos:', error);
    alert('Error al cargar datos');
  }
}

document.getElementById('data-container').addEventListener('click', (e) => {
  const boton = e.target.closest('.btn-eliminar');
  console.log(boton);
  if (!boton) return;
  eliminarMantenimiento(boton);
});

async function cargarSelectEdicion() {
  try {
    const response = await fetch('/datos-formulario');
    const { equipos, repuestos } = await response.json();

    const selectEquipo = document.getElementById('selectEquipoEdicion');
    selectEquipo.innerHTML = '<option value="">Seleccione un equipo</option>';
    equipos.forEach(equipo => {
      const option = document.createElement('option');
      option.value = equipo.equipo_id;
      option.textContent = equipo.nombre;
      selectEquipo.appendChild(option);
    });

    const selectRepuesto = document.getElementById('selectRepuestoEdicion');
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

async function cargarSelect() {
  try {
    const response = await fetch('/datos-formulario');
    const { equipos, repuestos } = await response.json();

    const selectEquipo = document.getElementById('selectEquipo');
    selectEquipo.innerHTML = '<option value="">Seleccione un equipo</option>';
    equipos.forEach(equipo => {
      const option = document.createElement('option');
      option.value = equipo.equipo_id;
      option.textContent = equipo.nombre;
      selectEquipo.appendChild(option);
    });

    const selectRepuesto = document.getElementById('selectRepuesto');
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

  if (!confirm('¿Estás seguro de eliminar esta orden de mantenimiento?')) {
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
    await cargarSelectEdicion();
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
});

document.addEventListener('DOMContentLoaded', async () => {
  await cargarTablaMantenimientos();
  await cargarSelect();
});

// ORDENES DE TRABAJO

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnOrdenTrabajo').addEventListener('click', async () => {
    try {
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

      const response = await fetch('/orden-trabajo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const result = await response.json();

      if (response.ok) {
        alert('¡Orden de trabajo generada correctamente!');
        bootstrap.Modal.getInstance(document.getElementById('modalOrdenTrabajo')).hide();
        await cargarTablaOrdenes();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al generar la orden de trabajo:', error);
      alert('Error al generar la orden de trabajo');
    }
  });
});

async function cargarTablaOrdenes() {
  try {
    const response = await fetch('/ordenes-trabajo');
    const ordenes = await response.json();

    const container = document.getElementById('datos-ordenes-trabajo');
    container.innerHTML = '';

    ordenes.forEach((orden, index) => {
      const badgeColor = orden.estado === 'En proceso' ? 'bg-warning text-dark' : 'bg-secondary';

      const fila = `
        <tr>
          <td>${index + 1}</td>
          <td>${orden.nombre_equipo}</td>
          <td>${orden.nombre_empleado}</td>
          <td>${orden.fecha_ejecucion.split('T')[0]}</td>
          <td>${orden.fecha_fin.split('T')[0]}</td>
          <td><span class="badge ${badgeColor}">${orden.prioridad}</span></td>
          <td><span class="badge ${badgeColor}">${orden.estado}</span></td>
        </tr>
      `;
      container.innerHTML += fila;
    });

  } catch (error) {
    console.error('Error al cargar la tabla de órdenes:', error);
  }
}