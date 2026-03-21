import type { CrearCuentaFormData, CrearCuentaErrors } from '../types/crearCuenta.types'

export function validarCrearCuenta(data: CrearCuentaFormData): CrearCuentaErrors {
  const errors: CrearCuentaErrors = {}

  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es requerido'
  } else if (data.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres'
  }

  if (!data.email.trim()) {
    errors.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Ingresa un email válido'
  }

  if (!data.password) {
    errors.password = 'La contraseña es requerida'
  } else if (data.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
  }

  return errors
}

export function tieneErrores(errors: CrearCuentaErrors): boolean {
  return Object.keys(errors).length > 0
}
