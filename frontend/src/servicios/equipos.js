import api from './api'

export async function registrarEquipo(datos) {
  const respuesta = await api.post('/equipos', datos)
  return respuesta.data
}
