const ESTILOS_ESTADO = {
  RECIBIDO: 'bg-blue-100 text-blue-700',
  EN_DIAGNOSTICO: 'bg-amber-100 text-amber-700',
  EN_REPARACION: 'bg-orange-100 text-orange-700',
  LISTO: 'bg-green-100 text-green-700',
  ENTREGADO: 'bg-morado-100 text-morado-700',
}

const ETIQUETAS_ESTADO = {
  RECIBIDO: 'Recibido',
  EN_DIAGNOSTICO: 'En diagnóstico',
  EN_REPARACION: 'En reparación',
  LISTO: 'Listo',
  ENTREGADO: 'Entregado',
}

function normalizarEstado(estado) {
  return (estado || '').toString().trim().toUpperCase().replace(/\s+/g, '_')
}

function EstadoTicket({ estado }) {
  const clave = normalizarEstado(estado)
  const estilos = ESTILOS_ESTADO[clave] || 'bg-gray-100 text-gray-700'
  const etiqueta = ETIQUETAS_ESTADO[clave] || estado

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos}`}>{etiqueta}</span>
  )
}

export default EstadoTicket
