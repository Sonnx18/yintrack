import { ESTADOS_TICKET } from '../utilidades/estadosTicket'

function normalizarEstado(estado) {
  return (estado || '').toString().trim().toUpperCase().replace(/\s+/g, '_')
}

function EstadoTicket({ estado }) {
  const clave = normalizarEstado(estado)
  const definicion = ESTADOS_TICKET.find((item) => item.clave === clave)
  const estilos = definicion?.estilos || 'bg-gray-100 text-gray-700'
  const etiqueta = definicion?.etiqueta || estado

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos}`}>{etiqueta}</span>
  )
}

export default EstadoTicket
