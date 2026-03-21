import type { CrearCuentaFormData, ApiResponse, Cuenta } from '../types/crearCuenta.types'
import exitoso from '../fixtures/exitoso/crearCuenta.fixture'
import emailDuplicado from '../fixtures/emailDuplicado/crearCuenta.fixture'
import errorServidor from '../fixtures/errorServidor/crearCuenta.fixture'

// --- Composer: cambia SCENARIO para probar distintos casos ---
const USE_MOCK = true

const fixtures = { exitoso, emailDuplicado, errorServidor }

// Cambia la clave para seleccionar el escenario activo
const SCENARIO: keyof typeof fixtures = 'exitoso'

const registrarReal = async (data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
  const response = await fetch('/api/crear-cuenta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

const registrarMock = async (_data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
  return fixtures[SCENARIO]
}

export const registrarService = USE_MOCK ? registrarMock : registrarReal
