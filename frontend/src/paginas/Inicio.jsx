import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import { ROLES } from '../utilidades/roles'

function Inicio() {
  const { usuario } = useAuth()

  if (usuario?.rol === ROLES.ADMIN) return <Navigate to="/admin" replace />
  if (usuario?.rol === ROLES.TECNICO) return <Navigate to="/tecnico" replace />
  if (usuario?.rol === ROLES.CLIENTE) return <Navigate to="/cliente" replace />

  return <Navigate to="/login" replace />
}

export default Inicio
