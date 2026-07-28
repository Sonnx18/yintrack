import api from './api'

export async function obtenerMisTickets({ pagina = 0, tamano = 5, estado } = {}) {
  const parametros = { page: pagina, size: tamano }
  if (estado) parametros.estado = estado

  const respuesta = await api.get('/tickets/mios', { params: parametros })
  return respuesta.data
}
