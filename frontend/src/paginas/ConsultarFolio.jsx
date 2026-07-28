import { useState } from 'react'
import { Link } from 'react-router-dom'
import CampoTexto from '../componentes/CampoTexto'
import Cargando from '../componentes/Cargando'
import EstadoTicket from '../componentes/EstadoTicket'
import Logo from '../componentes/Logo'
import api from '../servicios/api'
import { validarFolio } from '../utilidades/validaciones'

function ConsultarFolio() {
  const [folio, setFolio] = useState('')
  const [errorCampo, setErrorCampo] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')
  const [ticket, setTicket] = useState(null)
  const [cargando, setCargando] = useState(false)

  function manejarCambioFolio(evento) {
    const valor = evento.target.value
    setFolio(valor)
    setErrorCampo(validarFolio(valor))
  }

  async function manejarBusqueda(evento) {
    evento.preventDefault()
    setErrorGeneral('')
    setTicket(null)

    const error = validarFolio(folio)
    setErrorCampo(error)
    if (error) return

    setCargando(true)
    try {
      const respuesta = await api.get(`/tickets/${folio.trim()}`)
      setTicket(respuesta.data)
    } catch (error) {
      setErrorGeneral(
        error.response?.status === 404
          ? 'No se encontró ningún ticket con ese folio'
          : 'No se pudo consultar el folio, intenta de nuevo'
      )
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <Logo />

        <form onSubmit={manejarBusqueda} className="rounded-xl bg-white p-8 shadow-md">
          <CampoTexto
            etiqueta="Folio de tu equipo:"
            valor={folio}
            alCambiar={manejarCambioFolio}
            error={errorCampo}
            marcador="Ej. YIN-2026-000001"
          />

          {errorGeneral && <p className="mb-4 text-sm text-red-500">{errorGeneral}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-morado-500 py-2 font-semibold text-white hover:bg-morado-600 disabled:opacity-60"
          >
            {cargando ? <Cargando texto="Buscando..." /> : 'Consultar'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link to="/login" className="font-semibold text-morado-600 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </form>

        {ticket && (
          <div className="mt-6 rounded-xl bg-white p-6 text-left shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-morado-700">{ticket.folio}</h3>
              <EstadoTicket estado={ticket.estado} />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">
              {[ticket.tipo, ticket.marca, ticket.modelo].filter(Boolean).join(' · ')}
            </p>
            <p className="text-sm text-gray-500">{ticket.descripcionProblema}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsultarFolio
