import { createContext, useContext, useState } from 'react'
import { decodificarToken } from '../utilidades/jwt'

const AuthContext = createContext(null)

function construirUsuario(token) {
  const claims = decodificarToken(token)
  if (!claims) return null
  return {
    correo: claims.sub,
    rol: claims.rol,
    nombre: claims.nombre,
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(() => {
    const tokenGuardado = localStorage.getItem('token')
    return tokenGuardado ? construirUsuario(tokenGuardado) : null
  })

  function iniciarSesion(nuevoToken) {
    localStorage.setItem('token', nuevoToken)
    setToken(nuevoToken)
    const nuevoUsuario = construirUsuario(nuevoToken)
    setUsuario(nuevoUsuario)
    return nuevoUsuario
  }

  function cerrarSesion() {
    localStorage.removeItem('token')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ token, usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
