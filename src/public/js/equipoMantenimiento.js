async function cargarTablaEquipos() {
    try {
      const response = await fetch('/equipo');
      const equipos = await response.json();
  
      const tbody = document.getElementById('data-container');
      tbody.innerHTML = equipos.map(e => `
        <tr>
          <td>${e.equipo_id}</td>
          <td>${e.nombre}</td>
          <td>${e.descripcion}</td>
          <td>${new Date(e.fecha_instalacion).toLocaleDateString()}</td>
          <td>${e.estado}</td>
          <td>${e.frecuencia_mantenimiento}</td>
          <td>${e.modelo_id || 'N/A'}</td>
          <td>${e.ubicacion_id || 'N/A'}</td>
          <td class="actions">
            <a href="#" class="btn-eliminar" type="button" data-id="${e.equipo_id}"><i class="fas fa-trash text-danger mx-1"></i></a>
            <a href="#" type="button" class="btn-editar" data-id="${e.equipo_id}" data-bs-toggle="modal" data-bs-target="#modalEdicion"><i class="fas fa-pen text-warning mx-1"></i></a>
          </td>
        </tr>
      `).join('');
  
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      alert('Error al cargar datos');
    }
};
document.addEventListener('DOMContentLoaded', async () => {
    await cargarTablaEquipos();
});