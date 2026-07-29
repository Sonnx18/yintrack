import { useEffect, useState } from 'react'
import checkedIcono from '../assets/checked.png'
import clockIcono from '../assets/clock.png'
import docIcono from '../assets/doc.png'
import laptopIcono from '../assets/laptop.png'
import phoneIcono from '../assets/phone.png'
import Cargando from '../componentes/Cargando'
import EstadoTicket from '../componentes/EstadoTicket'
import { obtenerTodosLosTickets } from '../servicios/tickets'
import { obtenerUsuarios } from '../servicios/usuarios'
import { ESTADOS_TICKET } from '../utilidades/estadosTicket'
import { ROLES } from '../utilidades/roles'

function obtenerIniciales(nombre) {
  if (!nombre) return '?'
  const partes = nombre.split(' ')
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

function iconoDeEquipo(tipo) {
  if (tipo === 'Celular' || tipo === 'Tablet') return phoneIcono
  return laptopIcono
}

function AdminInicio() {
  const [tickets, setTickets] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    setError('')

    Promise.all([obtenerTodosLosTickets({ tamano: 50 }), obtenerUsuarios({ rol: ROLES.TECNICO, tamano: 10 })])
      .then(([datosTickets, datosTecnicos]) => {
        setTickets(datosTickets.content)
        setTecnicos(datosTecnicos.content)
      })
      .catch(() => {
        setError('No se pudo cargar la informacion del dashboard')
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  if (cargando) return <Cargando texto="Cargando dashboard..." />
  if (error) return <p className="text-sm text-red-500">{error}</p>

  let enProceso = 0
  let completados = 0
  const conteoPorEstado = {}

  for (const ticket of tickets) {
    if (ticket.estado === 'EN_DIAGNOSTICO' || ticket.estado === 'EN_REPARACION') {
      enProceso = enProceso + 1
    }
    if (ticket.estado === 'LISTO' || ticket.estado === 'ENTREGADO') {
      completados = completados + 1
    }
    conteoPorEstado[ticket.estado] = (conteoPorEstado[ticket.estado] || 0) + 1
  }

  const ticketsRecientes = tickets.slice(0, 4)

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-sm">
          <img src={docIcono} alt="" className="h-8 w-8 rounded-full bg-blue-100 p-1.5" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{tickets.length}</p>
            <p className="text-sm text-gray-500">Tickets Totales</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-sm">
          <img src={clockIcono} alt="" className="h-8 w-8 rounded-full bg-orange-100 p-1.5" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{enProceso}</p>
            <p className="text-sm text-gray-500">En proceso</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-sm">
          <img src={checkedIcono} alt="" className="h-8 w-8 rounded-full bg-green-100 p-1.5" />
          <div>
            <p className="text-2xl font-bold text-gray-800">{completados}</p>
            <p className="text-sm text-gray-500">Completados</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
          <h3 className="mb-3 font-bold text-gray-800">Tickets recientes</h3>
          {ticketsRecientes.length === 0 && <p className="text-sm text-gray-500">Sin tickets todavia</p>}
          {ticketsRecientes.map((ticket) => (
            <div key={ticket.id} className="flex items-center gap-3 border-b border-gray-50 py-3 last:border-0">
              <img src={iconoDeEquipo(ticket.tipo)} alt="" className="h-9 w-9 rounded-full bg-gray-100 p-2" />
              <div className="flex-1">
                <p className="font-semibold text-morado-700">{ticket.folio}</p>
                <p className="text-sm text-gray-600">{ticket.cliente}</p>
              </div>
              <EstadoTicket estado={ticket.estado} />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-bold text-gray-800">Estado de tickets</h3>
            {ESTADOS_TICKET.map((estado) => {
              const cantidad = conteoPorEstado[estado.clave] || 0
              const porcentaje = tickets.length === 0 ? 0 : (cantidad / tickets.length) * 100
              return (
                <div key={estado.clave} className="mb-3">
                  <div className="mb-1 flex justify-between text-sm text-gray-600">
                    <span>{estado.etiqueta}</span>
                    <span>{cantidad}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-morado-500"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-bold text-gray-800">Tecnicos activos</h3>
            {tecnicos.map((tecnico) => (
              <div key={tecnico.id} className="flex items-center gap-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-morado-500 text-sm font-semibold text-white">
                  {obtenerIniciales(tecnico.nombre)}
                </div>
                <p className="text-sm font-semibold text-gray-700">{tecnico.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminInicio
