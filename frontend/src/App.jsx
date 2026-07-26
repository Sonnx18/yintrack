import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './paginas/Login'
import Registro from './paginas/Registro'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
