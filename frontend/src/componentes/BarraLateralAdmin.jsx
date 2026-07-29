import { NavLink, useNavigate } from 'react-router-dom'
import logoBlanco from '../assets/logo-blanco.png'
import listIcono from '../assets/list.png'
import masIcono from '../assets/mas.png'
import usersIcono from '../assets/users.png'
import { useAuth } from '../contexto/AuthContext'

function BarraLateralAdmin() {
  const navigate = useNavigate()
  const { cerrarSesion } = useAuth()

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate('/login')
  }

  function claseBoton({ isActive }) {
    if (isActive) {
      return 'flex items-center gap-2 rounded-lg bg-amarillo-500 px-4 py-2 text-sm font-semibold text-gray-900'
    }
    return 'flex items-center gap-2 rounded-lg bg-morado-500 px-4 py-2 text-sm font-semibold text-white'
  }

  return (
    <div className="flex h-screen w-56 flex-shrink-0 flex-col justify-between bg-morado-950 p-4">
      <div>
        <img src={logoBlanco} alt="YIN soluciones" className="mx-auto mb-8 h-40" />

        <nav className="flex flex-col gap-3">
          <NavLink to="/admin" end className={claseBoton}>
            <img src={listIcono} alt="" className="h-4 w-4 invert" />
            Tickets
          </NavLink>
          <NavLink to="/admin/nuevo-cliente" className={claseBoton}>
            <img src={masIcono} alt="" className="h-4 w-4 invert" />
            Nuevo Usuario
          </NavLink>
          <NavLink to="/admin/clientes" className={claseBoton}>
            <img src={usersIcono} alt="" className="h-4 w-4 invert" />
            Clientes
          </NavLink>
        </nav>
      </div>

      <button
        type="button"
        onClick={manejarCerrarSesion}
        className="rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600"
      >
        Cerrar Sesion
      </button>
    </div>
  )
}

export default BarraLateralAdmin
