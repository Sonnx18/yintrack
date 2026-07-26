import { useNavigate } from 'react-router-dom'
import Navbar from '../componentes/Navbar'
import { useAuth } from '../contexto/AuthContext'

function DashboardTecnico() {
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useAuth()

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
      <div className="p-6 text-gray-600">Panel técnico en construcción</div>
    </div>
  )
}

export default DashboardTecnico
