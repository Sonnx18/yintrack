import api from './api'

export async function obtenerUsuarios({ pagina = 0, tamano = 5, nombre, rol } = {}) {
  const parametros = { page: pagina, size: tamano }
  if (nombre) parametros.nombre = nombre
  if (rol) parametros.rol = rol

  const respuesta = await api.get('/usuarios', { params: parametros })
  return respuesta.data
}

export async function crearUsuario(datos) {
  const respuesta = await api.post('/usuarios', datos)
  return respuesta.data
}

export async function actualizarUsuario(id, datos) {
  const respuesta = await api.put(`/usuarios/${id}`, datos)
  return respuesta.data
}

export async function eliminarUsuario(id) {
  await api.delete(`/usuarios/${id}`)
}
