import { Outlet } from 'react-router-dom'
import BarraLateralAdmin from '../componentes/BarraLateralAdmin'
import Navbar from '../componentes/Navbar'
import { useAuth } from '../contexto/AuthContext'

function DashboardAdmin() {
  const { usuario } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BarraLateralAdmin />

      <div className="flex-1">
        <Navbar titulo="DASHBOARD" subtitulo="Resumen de operaciones - Julio 2026" usuario={usuario} />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
