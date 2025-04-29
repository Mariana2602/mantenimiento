let mantenimientosGlobal = [];

async function cargarReporte() {
  try {
    const response = await fetch('/reporte/lista');
    const mantenimientos = await response.json();
    mantenimientosGlobal = mantenimientos; // INFO GUARDADA PARA EL MODAL

    const tbody = document.getElementById('data-container');
    if (mantenimientosGlobal.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8">No hay reportes para mostrar.</td></tr>';
      return;
    }
    tbody.innerHTML = mantenimientos.map(m => `
      <tr id="mantenimiento-row-${m.mantenimiento_id}">
        <td>${m.nombre ?? 'Sin especificar'} ${m.apellido ?? ''}</td>
        <td>${new Date(m.fecha_creacion).toLocaleDateString()}</td>
        <td>${new Date(m.fecha_ejecucion).toLocaleDateString()}</td>
        <td>${new Date(m.fecha_fin).toLocaleDateString()}</td>
        <td>${m.tipomantenimiento}</td>
        <td>${m.equipos_nombre || 'Sin especificar'}</td>
        <td>${m.estado}</td>
        <td class="actions" id="acciones-${m.mantenimiento_id}">
          <a href="#" class="btn-detalles" data-id="${m.mantenimiento_id}" data-bs-toggle="modal" data-bs-target="#modalDetalles"><i class="fas fa-info mx-1"></i></a>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error al cargar mantenimientos:', error);
    alert('Error al cargar datos');
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  await cargarReporte();
});

// MOSTRAR MAS DETALLES EN EL MODAL
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-detalles');
  if (!btn) return;
  e.preventDefault();
  const id = btn.getAttribute('data-id');
  const m = mantenimientosGlobal.find(x => x.mantenimiento_id == id);
  if (!m) return;

  const detalleBody = document.getElementById('detalle-body');
  detalleBody.innerHTML = `
    <tr><th>Encargado</th><td>${m.nombre ?? 'Sin especificar'} ${m.apellido ?? ''}</td></tr>
    <tr><th>Cedula</th><td>${m.cedula ?? 'Sin especificar'}</td></tr>
    <tr><th>Cargo</th><td>${m.cargo ?? 'Sin especificar'}</td></tr>
    <tr><th>ID servicio</th><td>${m.mantenimiento_id}</td></tr>
    <tr><th>Solicitud</th><td>${new Date(m.fecha_creacion).toLocaleDateString()}</td></tr>
    <tr><th>Inicio</th><td>${new Date(m.fecha_ejecucion).toLocaleDateString()}</td></tr>
    <tr><th>Fin</th><td>${new Date(m.fecha_fin).toLocaleDateString()}</td></tr>
    <tr><th>Tipo</th><td>${m.tipomantenimiento}</td></tr>
    <tr><th>Objetivo</th><td>${m.equipos_nombre ?? 'Sin especificar'}</td></tr>
    <tr><th>Materiales</th><td>${m.repuestos_nombre ?? 'Sin especificar'}</td></tr>
    <tr><th>Estatus</th><td>${m.estado}</td></tr>
    <tr><th>Descripcion</th><td>${m.descripcion}</td></tr>
  `;
});

document.addEventListener('DOMContentLoaded', async () => {
  await cargarReporte();
});


$('#imprimir').on('click', function(event){
  window.print();
});

function buscarReportes() {
  var input = document.getElementById("buscadorReportes");
  var filter = input.value.toUpperCase();
  var table = document.getElementById("ordenes-mantenimiento");
  var tr = table.getElementsByTagName("tr");

  for (var i = 0; i < tr.length; i++) {
    if (tr[i].getElementsByTagName("th").length > 0) {
      continue;
    }
    var foundMatch = false;
    var tds = tr[i].getElementsByTagName("td");
    for (var j = 0; j < tds.length; j++) {
      var td = tds[j];
      if (td) {
        var txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          foundMatch = true;
          break;
        }
      }
    }
    if (foundMatch) {
      tr[i].style.display = "";
    } else {
      if (tr[i].getElementsByTagName("th").length === 0) {
        tr[i].style.display = "none";
      }
    }
  }
}
