import api from './api'

export async function obtenerMisTickets({ pagina = 0, tamano = 5, estado } = {}) {
  const parametros = { page: pagina, size: tamano }
  if (estado) parametros.estado = estado

  const respuesta = await api.get('/tickets/mios', { params: parametros })
  return respuesta.data
}

export async function obtenerTicketsAsignados({ pagina = 0, tamano = 5 } = {}) {
  const respuesta = await api.get('/tickets/asignados', {
    params: { page: pagina, size: tamano },
  })
  return respuesta.data
}

export async function actualizarEstadoTicket(id, estado, comentario) {
  const respuesta = await api.patch(`/tickets/${id}/estado`, { estado, comentario })
  return respuesta.data
}
