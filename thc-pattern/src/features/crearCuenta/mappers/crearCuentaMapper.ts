import type { Cuenta } from '../types/crearCuenta.types'

// Forma en que el backend devuelve la cuenta (snake_case)
export interface CuentaApiRaw {
  id: string
  nombre: string
  email: string
  created_at: string
}

// Mapea la respuesta raw del backend a la entidad interna
export function mapCuentaFromApi(raw: CuentaApiRaw): Cuenta {
  return {
    id: raw.id,
    nombre: raw.nombre,
    email: raw.email,
    createdAt: raw.created_at,
  }
}
