function CampoTexto({ etiqueta, tipo = 'text', valor, alCambiar, error, marcador, nombre, maxLength }) {
  return (
    <div className="mb-4 text-left">
      <label className="mb-1 block text-sm font-medium text-gray-700">{etiqueta}</label>
      <input
        type={tipo}
        name={nombre}
        value={valor}
        onChange={alCambiar}
        placeholder={marcador}
        maxLength={maxLength}
        className={`w-full rounded-lg border bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-morado-500 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      <p className="mt-1 min-h-[1.25rem] text-sm text-red-500">{error}</p>
    </div>
  )
}

export default CampoTexto
