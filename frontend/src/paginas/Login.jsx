import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CampoTexto from '../componentes/CampoTexto'
import Cargando from '../componentes/Cargando'
import Logo from '../componentes/Logo'
import PanelBienvenida from '../componentes/PanelBienvenida'
import api from '../servicios/api'
import { validarCorreo, validarContrasena } from '../utilidades/validaciones'

function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(false)

  function validarFormulario() {
    const nuevosErrores = {
      correo: validarCorreo(correo),
      contrasena: validarContrasena(contrasena),
    }
    setErrores(nuevosErrores)
    return !nuevosErrores.correo && !nuevosErrores.contrasena
  }

  function manejarCambioCorreo(evento) {
    const valor = evento.target.value
    setCorreo(valor)
    setErrores((anteriores) => ({ ...anteriores, correo: validarCorreo(valor) }))
  }

  function manejarCambioContrasena(evento) {
    const valor = evento.target.value
    setContrasena(valor)
    setErrores((anteriores) => ({ ...anteriores, contrasena: validarContrasena(valor) }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral('')
    if (!validarFormulario()) return

    setCargando(true)
    try {
      const respuesta = await api.post('/auth/login', { correo, contrasena })
      localStorage.setItem('token', respuesta.data.token)
      navigate('/')
    } catch (error) {
      setErrorGeneral(
        error.response?.data?.message || 'No se pudo iniciar sesión, intenta de nuevo'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <PanelBienvenida />

      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12">
        <form onSubmit={manejarEnvio} className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
          <Logo />

          <CampoTexto
            etiqueta="Introduce tu correo:"
            tipo="email"
            valor={correo}
            alCambiar={manejarCambioCorreo}
            error={errores.correo}
            marcador="Usuario o correo"
          />
          <CampoTexto
            etiqueta="Introduce tu contraseña:"
            tipo="password"
            valor={contrasena}
            alCambiar={manejarCambioContrasena}
            error={errores.contrasena}
            marcador="Contraseña"
          />

          {errorGeneral && <p className="mb-4 text-sm text-red-500">{errorGeneral}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-morado-500 py-2 font-semibold text-white hover:bg-morado-600 disabled:opacity-60"
          >
            {cargando ? <Cargando texto="Entrando..." /> : 'Entrar'}
          </button>

          <p className="mt-3 text-center text-sm">
            <Link to="/recuperar-contrasena" className="text-morado-600 hover:underline">
              ¿Olvidaste la contraseña?
            </Link>
          </p>
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Aun no tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-morado-600 hover:underline">
              Registrarse
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
