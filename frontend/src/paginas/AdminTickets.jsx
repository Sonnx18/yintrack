import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cargando from '../componentes/Cargando'
import EstadoTicket from '../componentes/EstadoTicket'
import Paginacion from '../componentes/Paginacion'
import { obtenerTodosLosTickets } from '../servicios/tickets'

const TAMANO_PAGINA = 10

function formatearFecha(fecha) {
  if (!fecha) return ''
  const soloFecha = fecha.split('T')[0]
  const [anio, mes, dia] = soloFecha.split('-')
  return `${dia}/${mes}/${anio}`
}

function AdminTickets() {
  const [tickets, setTickets] = useState([])
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    setError('')

    obtenerTodosLosTickets({ pagina, tamano: TAMANO_PAGINA })
      .then((datos) => {
        setTickets(datos.content)
        setTotalPaginas(datos.totalPages)
      })
      .catch(() => {
        setError('No se pudieron cargar los tickets, intenta de nuevo')
      })
      .finally(() => {
        setCargando(false)
      })
  }, [pagina])

  return (
    <div>
      <Link to="/admin" className="mb-4 inline-block text-sm font-semibold text-morado-600 hover:underline">
        ← Volver
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Todos los tickets</h2>
        <Link
          to="/admin/nuevo-ticket"
          className="rounded-lg bg-morado-500 px-4 py-2 text-sm font-semibold text-white hover:bg-morado-600"
        >
          + Nuevo Ticket
        </Link>
      </div>

      {cargando && <Cargando texto="Cargando tickets..." />}
      {!cargando && error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {!cargando && !error && tickets.length === 0 && (
        <p className="text-sm text-gray-500">No hay tickets todavia</p>
      )}

      {!cargando && !error && tickets.length > 0 && (
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
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-morado-700">{ticket.folio}</td>
                  <td className="px-4 py-3">{ticket.cliente}</td>
                  <td className="px-4 py-3">
                    {ticket.tipo} {ticket.marca} {ticket.modelo}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatearFecha(ticket.creadoEn)}</td>
                  <td className="px-4 py-3">
                    <EstadoTicket estado={ticket.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!cargando && !error && (
        <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} alCambiarPagina={setPagina} />
      )}
    </div>
  )
}

export default AdminTickets
