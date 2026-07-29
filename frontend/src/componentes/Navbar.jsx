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
