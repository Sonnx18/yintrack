function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="flex items-center justify-center gap-2 text-morado-600">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-morado-100 border-t-morado-600"></div>
      <span className="text-sm">{texto}</span>
    </div>
  )
}

export default Cargando
