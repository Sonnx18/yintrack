import logoMorado from '../assets/logo-morado.png'
import logoBlanco from '../assets/logo-blanco.png'

function Logo({ variante = 'morado', clase = 'h-16' }) {
  const logo = variante === 'blanco' ? logoBlanco : logoMorado

  return (
    <div className="mb-6 text-center">
      <img src={logo} alt="YIN soluciones" className={`mx-auto ${clase}`} />
    </div>
  )
}

export default Logo
