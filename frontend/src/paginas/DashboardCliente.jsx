import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cargando from '../componentes/Cargando'
import EstadoTicket from '../componentes/EstadoTicket'
import Navbar from '../componentes/Navbar'
import Paginacion from '../componentes/Paginacion'
import { useAuth } from '../contexto/AuthContext'
import { obtenerMisTickets } from '../servicios/tickets'
import { ESTADOS_TICKET } from '../utilidades/estadosTicket'

const TAMANO_PAGINA = 5

function DashboardCliente() {
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()
  const [tickets, setTickets] = useState([])
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError('')

    obtenerMisTickets({ pagina, tamano: TAMANO_PAGINA, estado: estadoFiltro })
      .then((datos) => {
        if (!activo) return
        setTickets(datos.content)
        setTotalPaginas(datos.totalPages)
      })
      .catch(() => {
        if (activo) setError('No se pudieron cargar tus tickets, intenta de nuevo')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [pagina, estadoFiltro])

  function manejarCambioFiltro(nuevoEstado) {
    setEstadoFiltro(nuevoEstado)
    setPagina(0)
  }

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        titulo="Mis Tickets"
        subtitulo="Estado de tus reparaciones"
        usuario={usuario}
        alCerrarSesion={manejarCerrarSesion}
      />

      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => manejarCambioFiltro('')}
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              estadoFiltro === '' ? 'bg-morado-500 text-white' : 'bg-white text-gray-600'
            }`}
          >
            Todos
          </button>
          {ESTADOS_TICKET.map((estado) => (
            <button
              key={estado.clave}
              type="button"
              onClick={() => manejarCambioFiltro(estado.clave)}
              className={`rounded-full px-4 py-1 text-sm font-semibold ${
                estadoFiltro === estado.clave ? 'bg-morado-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {estado.etiqueta}
            </button>
          ))}
        </div>

        {cargando && <Cargando texto="Cargando tickets..." />}
        {!cargando && error && <p className="text-sm text-red-500">{error}</p>}

        {!cargando && !error && tickets.length === 0 && (
          <p className="text-sm text-gray-500">No tienes tickets con ese filtro</p>
        )}

        {!cargando && !error && tickets.length > 0 && (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.folio}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-bold text-morado-700">{ticket.folio}</p>
                  <p className="text-sm font-medium text-gray-700">
                    {[ticket.tipo, ticket.marca, ticket.modelo].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-xs text-gray-500">{ticket.descripcionProblema}</p>
                </div>
                <EstadoTicket estado={ticket.estado} />
              </div>
            ))}
          </div>
        )}

        {!cargando && !error && (
          <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} alCambiarPagina={setPagina} />
        )}
      </div>
    </div>
  )
}

export default DashboardCliente
