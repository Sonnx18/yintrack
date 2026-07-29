import { useState } from 'react'
import CampoTexto from '../componentes/CampoTexto'
import Cargando from '../componentes/Cargando'
import { crearUsuario } from '../servicios/usuarios'
import { ROLES, ROLES_LISTA } from '../utilidades/roles'
import { validarCorreo, validarContrasena, validarNombre, validarTelefono } from '../utilidades/validaciones'

const USUARIO_VACIO = {
  nombre: '',
  correo: '',
  contrasena: '',
  telefono: '',
  rol: ROLES.CLIENTE,
}

function AdminNuevoUsuario() {
  const [formulario, setFormulario] = useState(USUARIO_VACIO)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  function manejarCambio(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  function validarFormulario() {
    const nuevosErrores = {
      nombre: validarNombre(formulario.nombre),
      correo: validarCorreo(formulario.correo),
      contrasena: validarContrasena(formulario.contrasena),
      telefono: validarTelefono(formulario.telefono),
    }
    setErrores(nuevosErrores)

    for (const campo in nuevosErrores) {
      if (nuevosErrores[campo]) return false
    }
    return true
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setMensaje('')
    setError('')
    if (!validarFormulario()) return

    setGuardando(true)
    try {
      await crearUsuario(formulario)
      setMensaje('Usuario registrado correctamente')
      setFormulario(USUARIO_VACIO)
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo registrar el usuario, intenta de nuevo')
    }
    setGuardando(false)
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800">Registrar nuevo usuario</h2>
      <p className="mb-6 text-sm text-gray-500">
        Se puede registrar un administrador, tecnico o cliente
      </p>

      <form onSubmit={manejarEnvio}>
        <CampoTexto
          etiqueta="Nombre completo:"
          valor={formulario.nombre}
          alCambiar={(evento) => manejarCambio('nombre', evento.target.value)}
          error={errores.nombre}
          marcador="Ej. Jose Torres Mendez"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CampoTexto
            etiqueta="Correo electronico:"
            tipo="email"
            valor={formulario.correo}
            alCambiar={(evento) => manejarCambio('correo', evento.target.value)}
            error={errores.correo}
            marcador="cliente@correo.com"
          />
          <CampoTexto
            etiqueta="Numero de telefono:"
            valor={formulario.telefono}
            alCambiar={(evento) => manejarCambio('telefono', evento.target.value)}
            error={errores.telefono}
            marcador="10 digitos"
            maxLength={10}
          />
        </div>

        <CampoTexto
          etiqueta="Contraseña:"
          tipo="password"
          valor={formulario.contrasena}
          alCambiar={(evento) => manejarCambio('contrasena', evento.target.value)}
          error={errores.contrasena}
          marcador="Contraseña"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">Rol:</label>
        <select
          value={formulario.rol}
          onChange={(evento) => manejarCambio('rol', evento.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
        >
          {ROLES_LISTA.map((rol) => (
            <option key={rol.clave} value={rol.clave}>
              {rol.etiqueta}
            </option>
          ))}
        </select>

        {mensaje && <p className="mb-4 text-sm text-green-600">{mensaje}</p>}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="w-full rounded-lg bg-morado-500 py-2 font-semibold text-white hover:bg-morado-600 disabled:opacity-60"
        >
          {guardando ? <Cargando texto="Registrando..." /> : 'Registrar Usuario'}
        </button>
      </form>
    </div>
  )
}

export default AdminNuevoUsuario
