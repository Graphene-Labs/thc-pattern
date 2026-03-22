import type { CrearCuentaFormData, ApiResponse, Cuenta } from '../types/crearCuenta.types'

export const crearCuentaService = {
  registrar: async (data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
    const response = await fetch('/api/crear-cuenta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },
}
