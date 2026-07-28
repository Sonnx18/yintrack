function Paginacion({ paginaActual, totalPaginas, alCambiarPagina }) {
  if (totalPaginas <= 1) return null

  const paginas = Array.from({ length: totalPaginas }, (_, indice) => indice)

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => alCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 0}
        className="rounded-lg px-2 py-1 text-morado-600 disabled:opacity-30"
      >
        ‹
      </button>
      {paginas.map((pagina) => (
        <button
          key={pagina}
          type="button"
          onClick={() => alCambiarPagina(pagina)}
          className={`h-8 w-8 rounded-lg text-sm font-semibold ${
            pagina === paginaActual ? 'bg-morado-500 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {pagina + 1}
        </button>
      ))}
      <button
        type="button"
        onClick={() => alCambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas - 1}
        className="rounded-lg px-2 py-1 text-morado-600 disabled:opacity-30"
      >
        ›
      </button>
    </div>
  )
}

export default Paginacion
