function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  alConfirmar,
  alCancelar,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
}) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
        <p className="mt-2 text-sm text-gray-600">{mensaje}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={alCancelar}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={alConfirmar}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacion
