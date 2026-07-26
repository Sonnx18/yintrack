import { useNavigate } from 'react-router-dom'
import Navbar from '../componentes/Navbar'
import { useAuth } from '../contexto/AuthContext'

function DashboardCliente() {
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()

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
      <div className="p-6 text-gray-600">Listado de tickets en construcción</div>
    </div>
  )
}

export default DashboardCliente
