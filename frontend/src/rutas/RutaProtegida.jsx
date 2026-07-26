import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

function RutaProtegida({ rolesPermitidos, children }) {
  const { token, usuario } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario?.rol)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RutaProtegida
