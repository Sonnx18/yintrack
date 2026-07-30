import fondoCircuitos from '../assets/fondo-circuitos.jpg'

function PanelBienvenida() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-morado-700 px-12 py-16 text-center text-white md:w-1/2">
      <img
        src={fondoCircuitos}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-10"
      />
      <div className="relative z-10">
        <h2 className="mb-4 text-3xl font-bold">Bienvenidos a YIN</h2>
        <p className="max-w-sm text-sm text-morado-100">
          En este sistema podrás darle seguimiento a reparaciones o trabajos que se estén realizando
        </p>
      </div>
    </div>
  )
}

export default PanelBienvenida
