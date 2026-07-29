import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cargando from '../componentes/Cargando'
import { registrarEquipo } from '../servicios/equipos'
import { obtenerUsuarios } from '../servicios/usuarios'
import { ROLES } from '../utilidades/roles'

const TIPOS_EQUIPO = ['Laptop', 'PC de escritorio', 'Celular', 'Tablet', 'Consola', 'Otro']

const FORMULARIO_VACIO = {
  clienteId: '',
  tipo: TIPOS_EQUIPO[0],
  tipoOtro: '',
  marca: '',
  modelo: '',
  descripcionProblema: '',
}

function NuevoTicket() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [cargandoClientes, setCargandoClientes] = useState(true)

  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    obtenerUsuarios({ rol: ROLES.CLIENTE, tamano: 100 })
      .then((datos) => setClientes(datos.content))
      .catch(() => setError('No se pudo cargar la lista de clientes'))
      .finally(() => setCargandoClientes(false))
  }, [])

  function manejarCambio(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setMensaje('')
    setError('')

    if (!formulario.clienteId) {
      setError('Selecciona un cliente')
      return
    }
    if (formulario.tipo === 'Otro' && !formulario.tipoOtro.trim()) {
      setError('Escribe el tipo de equipo')
      return
    }
    if (!formulario.descripcionProblema.trim()) {
      setError('Describe el problema del equipo')
      return
    }

    setGuardando(true)
    try {
      const respuesta = await registrarEquipo({
        ...formulario,
        clienteId: Number(formulario.clienteId),
        tipo: formulario.tipo === 'Otro' ? formulario.tipoOtro.trim() : formulario.tipo,
      })
      setMensaje(`Ticket creado con folio ${respuesta.folio}`)
      setFormulario(FORMULARIO_VACIO)
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo registrar el ticket, intenta de nuevo')
    }
    setGuardando(false)
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-block text-sm font-semibold text-morado-600 hover:underline"
      >
        ← Volver
      </button>

      <h2 className="text-lg font-bold text-gray-800">Registrar nuevo ticket</h2>
      <p className="mb-6 text-sm text-gray-500">Completa los campos del cliente y el equipo que trae a reparar</p>

      {cargandoClientes ? (
        <Cargando texto="Cargando clientes..." />
      ) : (
        <form onSubmit={manejarEnvio}>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cliente:</label>
          <select
            value={formulario.clienteId}
            onChange={(evento) => manejarCambio('clienteId', evento.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
          >
            <option value="">Seleccionar...</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} ({cliente.correo})
              </option>
            ))}
          </select>

          <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de equipo:</label>
          <select
            value={formulario.tipo}
            onChange={(evento) => manejarCambio('tipo', evento.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
          >
            {TIPOS_EQUIPO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          {formulario.tipo === 'Otro' && (
            <input
              type="text"
              value={formulario.tipoOtro}
              onChange={(evento) => manejarCambio('tipoOtro', evento.target.value)}
              placeholder="Escribe el tipo de equipo"
              className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
            />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Marca:</label>
              <input
                type="text"
                value={formulario.marca}
                onChange={(evento) => manejarCambio('marca', evento.target.value)}
                placeholder="Ej. Dell"
                className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Modelo:</label>
              <input
                type="text"
                value={formulario.modelo}
                onChange={(evento) => manejarCambio('modelo', evento.target.value)}
                placeholder="Ej. Inspiron 15"
                className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
              />
            </div>
          </div>

          <label className="mb-1 block text-sm font-medium text-gray-700">Descripción del problema:</label>
          <textarea
            value={formulario.descripcionProblema}
            onChange={(evento) => manejarCambio('descripcionProblema', evento.target.value)}
            placeholder="Describe el problema o falla que presenta el equipo"
            rows={4}
            className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
          />

          {mensaje && <p className="mb-4 text-sm text-green-600">{mensaje}</p>}
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={guardando}
            className="w-full rounded-lg bg-morado-500 py-2 font-semibold text-white hover:bg-morado-600 disabled:opacity-60"
          >
            {guardando ? <Cargando texto="Registrando..." /> : 'Registrar Ticket'}
          </button>
        </form>
      )}
    </div>
  )
}

export default NuevoTicket
