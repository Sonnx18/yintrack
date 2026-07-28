import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cargando from '../componentes/Cargando'
import Navbar from '../componentes/Navbar'
import Paginacion from '../componentes/Paginacion'
import { useAuth } from '../contexto/AuthContext'
import { actualizarEstadoTicket, obtenerTicketsAsignados } from '../servicios/tickets'
import { ESTADOS_TICKET } from '../utilidades/estadosTicket'

const TAMANO_PAGINA = 5

function formatearFecha(fecha) {
  if (!fecha) return ''
  const soloFecha = fecha.split('T')[0]
  const [anio, mes, dia] = soloFecha.split('-')
  return `${dia}/${mes}/${anio}`
}

function DashboardTecnico() {
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()
  const [equipos, setEquipos] = useState([])
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalAsignados, setTotalAsignados] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [actualizando, setActualizando] = useState(false)

  useEffect(() => {
    cargarEquipos()
  }, [pagina])

  function cargarEquipos() {
    setCargando(true)
    setError('')

    obtenerTicketsAsignados({ pagina, tamano: TAMANO_PAGINA })
      .then((datos) => {
        setEquipos(datos.content)
        setTotalPaginas(datos.totalPages)
        setTotalAsignados(datos.totalElements)
      })
      .catch(() => {
        setError('No se pudieron cargar tus equipos asignados, intenta de nuevo')
      })
      .finally(() => {
        setCargando(false)
      })
  }

  let enProceso = 0
  for (const ticket of equipos) {
    if (ticket.estado === 'EN_DIAGNOSTICO' || ticket.estado === 'EN_REPARACION') {
      enProceso = enProceso + 1
    }
  }

  async function manejarCambioEstado(ticket, nuevoEstado) {
    setActualizando(true)
    setError('')
    try {
      await actualizarEstadoTicket(ticket.id, nuevoEstado)
      const nuevosEquipos = equipos.map((item) => {
        if (item.id === ticket.id) {
          return { ...item, estado: nuevoEstado }
        }
        return item
      })
      setEquipos(nuevosEquipos)
    } catch {
      setError('No se pudo actualizar el estado, intenta de nuevo')
    }
    setActualizando(false)
  }

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        titulo="Panel Técnico"
        subtitulo="Gestión de equipos asignados"
        usuario={usuario}
        alCerrarSesion={manejarCerrarSesion}
      />

      <div className="p-6">
        <div className="mb-6 flex gap-4">
          <div className="rounded-xl bg-white px-6 py-4 shadow-sm">
            <p className="text-2xl font-bold text-morado-700">{totalAsignados}</p>
            <p className="text-sm text-gray-500">Asignados</p>
          </div>
          <div className="rounded-xl bg-white px-6 py-4 shadow-sm">
            <p className="text-2xl font-bold text-orange-600">{enProceso}</p>
            <p className="text-sm text-gray-500">En proceso (esta página)</p>
          </div>
        </div>

        {cargando && <Cargando texto="Cargando equipos asignados..." />}
        {!cargando && error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {!cargando && equipos.length === 0 && (
          <p className="text-sm text-gray-500">No tienes equipos asignados</p>
        )}

        {!cargando && equipos.length > 0 && (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="px-4 py-3">Folio</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Equipo</th>
                  <th className="px-4 py-3">Recibido</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-semibold text-morado-700">{ticket.folio}</td>
                    <td className="px-4 py-3">{ticket.cliente}</td>
                    <td className="px-4 py-3">
                      {ticket.tipo} {ticket.marca} {ticket.modelo}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatearFecha(ticket.creadoEn)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={ticket.estado}
                        disabled={actualizando}
                        onChange={(evento) => manejarCambioEstado(ticket, evento.target.value)}
                        className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold disabled:opacity-50"
                      >
                        {ESTADOS_TICKET.map((estado) => (
                          <option key={estado.clave} value={estado.clave}>
                            {estado.etiqueta}
                          </option>
                        ))}
                      </select>
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
      </div>
    </div>
  )
}

export default DashboardTecnico
