function obtenerIniciales(nombre) {
  if (!nombre) return '?'
  return nombre
    .split(' ')
    .map((palabra) => palabra[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Navbar({ titulo, subtitulo, usuario, alCerrarSesion }) {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{titulo}</h1>
        {subtitulo && <p className="text-sm text-gray-500">{subtitulo}</p>}
      </div>
      <div className="flex items-center gap-4">
        <svg
          className="h-6 w-6 text-morado-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{usuario?.nombre}</p>
          <p className="text-xs text-gray-500">{usuario?.rol}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-morado-500 text-sm font-semibold text-white">
          {obtenerIniciales(usuario?.nombre)}
        </div>
        {alCerrarSesion && (
          <button
            type="button"
            onClick={alCerrarSesion}
            className="text-sm font-medium text-red-500 hover:underline"
          >
            Cerrar sesion
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
