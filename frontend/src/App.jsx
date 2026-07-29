import { Route, Routes } from 'react-router-dom'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Inicio from './paginas/Inicio'
import ConsultarFolio from './paginas/ConsultarFolio'
import DashboardAdmin from './paginas/DashboardAdmin'
import AdminInicio from './paginas/AdminInicio'
import AdminTickets from './paginas/AdminTickets'
import AdminNuevoUsuario from './paginas/AdminNuevoUsuario'
import AdminUsuarios from './paginas/AdminUsuarios'
import NuevoTicket from './paginas/NuevoTicket'
import DashboardTecnico from './paginas/DashboardTecnico'
import DashboardCliente from './paginas/DashboardCliente'
import RutaProtegida from './rutas/RutaProtegida'
import { ROLES } from './utilidades/roles'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/consultar-folio" element={<ConsultarFolio />} />
      <Route path="/" element={<Inicio />} />
      <Route
        path="/admin"
        element={
          <RutaProtegida rolesPermitidos={[ROLES.ADMIN]}>
            <DashboardAdmin />
          </RutaProtegida>
        }
      >
        <Route index element={<AdminInicio />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="nuevo-cliente" element={<AdminNuevoUsuario />} />
        <Route path="clientes" element={<AdminUsuarios />} />
        <Route path="nuevo-ticket" element={<NuevoTicket />} />
      </Route>
      <Route
        path="/tecnico"
        element={
          <RutaProtegida rolesPermitidos={[ROLES.TECNICO]}>
            <DashboardTecnico />
          </RutaProtegida>
        }
      />
      <Route
        path="/tecnico/nuevo-ticket"
        element={
          <RutaProtegida rolesPermitidos={[ROLES.TECNICO]}>
            <NuevoTicket />
          </RutaProtegida>
        }
      />
      <Route
        path="/cliente"
        element={
          <RutaProtegida rolesPermitidos={[ROLES.CLIENTE]}>
            <DashboardCliente />
          </RutaProtegida>
        }
      />
    </Routes>
  )
}

export default App
