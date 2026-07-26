const EXPRESION_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EXPRESION_TELEFONO = /^[0-9]{10}$/

export function validarCorreo(correo) {
  if (!correo) return 'El correo es obligatorio'
  if (!EXPRESION_CORREO.test(correo)) return 'Introduce un correo válido'
  return ''
}

export function validarContrasena(contrasena) {
  if (!contrasena) return 'La contraseña es obligatoria'
  if (contrasena.length < 8) return 'Debe tener mínimo 8 caracteres'
  if (!/[A-Z]/.test(contrasena)) return 'Debe incluir al menos una mayúscula'
  if (!/[0-9]/.test(contrasena)) return 'Debe incluir al menos un número'
  if (!/[^A-Za-z0-9]/.test(contrasena)) return 'Debe incluir al menos un carácter especial'
  return ''
}

export function validarTelefono(telefono) {
  if (!telefono) return 'El teléfono es obligatorio'
  if (!EXPRESION_TELEFONO.test(telefono)) return 'Debe tener 10 dígitos'
  return ''
}

export function validarNombre(nombre) {
  if (!nombre || !nombre.trim()) return 'El nombre es obligatorio'
  return ''
}
