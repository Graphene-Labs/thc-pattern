import { composeConfig } from '../../../config/composeConfig'
import type { CrearCuentaFormData, ApiResponse, Cuenta } from '../types/crearCuenta.types'
import exitoso from '../fixtures/exitoso/crearCuenta.fixture'
import emailDuplicado from '../fixtures/emailDuplicado/crearCuenta.fixture'
import errorServidor from '../fixtures/errorServidor/crearCuenta.fixture'

const fixtures = { exitoso, emailDuplicado, errorServidor }
const scenario = composeConfig.crearCuenta.scenario as keyof typeof fixtures

export const crearCuentaService = {
  registrar: async (_data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
    return fixtures[scenario]
  },
}
