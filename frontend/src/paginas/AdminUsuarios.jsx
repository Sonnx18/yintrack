import { useEffect, useState } from 'react'
import Cargando from '../componentes/Cargando'
import CampoTexto from '../componentes/CampoTexto'
import ModalConfirmacion from '../componentes/ModalConfirmacion'
import Paginacion from '../componentes/Paginacion'
import { actualizarUsuario, eliminarUsuario, obtenerUsuarios } from '../servicios/usuarios'
import { ROLES, ROLES_LISTA } from '../utilidades/roles'
import { validarNombre, validarTelefono } from '../utilidades/validaciones'

const TAMANO_PAGINA = 5

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const [filtroNombre, setFiltroNombre] = useState('')

  const [editando, setEditando] = useState(null)
  const [erroresFormulario, setErroresFormulario] = useState({})
  const [guardando, setGuardando] = useState(false)

  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)

  useEffect(() => {
    cargarUsuarios()
  }, [pagina, filtroNombre])

  function cargarUsuarios() {
    setCargando(true)
    setError('')

    obtenerUsuarios({ pagina, tamano: TAMANO_PAGINA, nombre: filtroNombre, rol: ROLES.CLIENTE })
      .then((datos) => {
        setUsuarios(datos.content)
        setTotalPaginas(datos.totalPages)
      })
      .catch(() => {
        setError('No se pudieron cargar los usuarios, intenta de nuevo')
      })
      .finally(() => {
        setCargando(false)
      })
  }

  function manejarBuscar() {
    setPagina(0)
    setFiltroNombre(nombreBusqueda)
  }

  function abrirEditar(usuarioFila) {
    setEditando({ ...usuarioFila })
    setErroresFormulario({})
  }

  function manejarCambioEdicion(campo, valor) {
    setEditando({ ...editando, [campo]: valor })
  }

  async function manejarGuardarEdicion(evento) {
    evento.preventDefault()

    const nuevosErrores = {
      nombre: validarNombre(editando.nombre),
      telefono: validarTelefono(editando.telefono),
    }
    setErroresFormulario(nuevosErrores)
    if (nuevosErrores.nombre || nuevosErrores.telefono) return

    setGuardando(true)
    try {
      await actualizarUsuario(editando.id, editando)
      setEditando(null)
      cargarUsuarios()
    } catch {
      setError('No se pudo guardar el usuario, intenta de nuevo')
    }
    setGuardando(false)
  }

  async function confirmarEliminar() {
    try {
      await eliminarUsuario(usuarioAEliminar.id)
      setUsuarioAEliminar(null)
      cargarUsuarios()
    } catch {
      setError('No se pudo eliminar el usuario, intenta de nuevo')
      setUsuarioAEliminar(null)
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-800">Clientes</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={nombreBusqueda}
          onChange={(evento) => setNombreBusqueda(evento.target.value)}
          placeholder="Buscar por nombre..."
          className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
        />
        <button
          type="button"
          onClick={manejarBuscar}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
        >
          Buscar
        </button>
      </div>

      {cargando && <Cargando texto="Cargando usuarios..." />}
      {!cargando && error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {!cargando && usuarios.length === 0 && (
        <p className="text-sm text-gray-500">No hay usuarios con ese filtro</p>
      )}

      {!cargando && usuarios.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Telefono</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((fila) => (
                <tr key={fila.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-morado-700">{fila.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{fila.correo}</td>
                  <td className="px-4 py-3">{fila.telefono}</td>
                  <td className="px-4 py-3">{fila.rol}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => abrirEditar(fila)}
                      className="mr-3 font-semibold text-morado-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setUsuarioAEliminar(fila)}
                      className="font-semibold text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!cargando && (
        <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} alCambiarPagina={setPagina} />
      )}

      {editando && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={manejarGuardarEdicion} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Editar usuario</h3>

            <CampoTexto
              etiqueta="Nombre completo:"
              valor={editando.nombre}
              alCambiar={(evento) => manejarCambioEdicion('nombre', evento.target.value)}
              error={erroresFormulario.nombre}
            />
            <CampoTexto
              etiqueta="Telefono:"
              valor={editando.telefono}
              alCambiar={(evento) => manejarCambioEdicion('telefono', evento.target.value)}
              error={erroresFormulario.telefono}
            />

            <label className="mb-1 block text-sm font-medium text-gray-700">Rol:</label>
            <select
              value={editando.rol}
              onChange={(evento) => manejarCambioEdicion('rol', evento.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
            >
              {ROLES_LISTA.map((rol) => (
                <option key={rol.clave} value={rol.clave}>
                  {rol.etiqueta}
                </option>
              ))}
            </select>

            <label className="mb-4 flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={editando.activo}
                onChange={(evento) => manejarCambioEdicion('activo', evento.target.checked)}
              />
              Usuario activo
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="rounded-lg bg-morado-500 px-4 py-2 text-sm font-semibold text-white hover:bg-morado-600 disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ModalConfirmacion
        abierto={usuarioAEliminar !== null}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que quieres eliminar a ${usuarioAEliminar?.nombre}? Ya no podra iniciar sesion.`}
        textoConfirmar="Eliminar"
        alConfirmar={confirmarEliminar}
        alCancelar={() => setUsuarioAEliminar(null)}
      />
    </div>
  )
}

export default AdminUsuarios
