import { composeConfig } from '@/config/composeConfig'
import type { CrearCuentaFormData, ApiResponse, Cuenta, VerificacionEmailResponse } from '../types/crearCuenta.types'
import exitosoCuenta from '../fixtures/exitoso/crearCuenta.fixture'
import exitosoEmail from '../fixtures/exitoso/verificacionEmail.fixture'
import emailDuplicadoCuenta from '../fixtures/emailDuplicado/crearCuenta.fixture'
import emailDuplicadoEmail from '../fixtures/emailDuplicado/verificacionEmail.fixture'
import errorServidorCuenta from '../fixtures/errorServidor/crearCuenta.fixture'
import errorServidorEmail from '../fixtures/errorServidor/verificacionEmail.fixture'
import emailServiceUnavailableCuenta from '../fixtures/emailServiceUnavailable/crearCuenta.fixture'
import emailServiceUnavailableEmail from '../fixtures/emailServiceUnavailable/verificacionEmail.fixture'

const fixturesCuenta = {
  exitoso: exitosoCuenta,
  emailDuplicado: emailDuplicadoCuenta,
  errorServidor: errorServidorCuenta,
  emailServiceUnavailable: emailServiceUnavailableCuenta,
}

const fixturesEmail = {
  exitoso: exitosoEmail,
  emailDuplicado: emailDuplicadoEmail,
  errorServidor: errorServidorEmail,
  emailServiceUnavailable: emailServiceUnavailableEmail,
}

const scenario = composeConfig.crearCuenta.scenario as keyof typeof fixturesCuenta

export const crearCuentaService = {
  registrar: async (_data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
    return fixturesCuenta[scenario]
  },

  enviarVerificacionEmail: async (_email: string): Promise<ApiResponse<VerificacionEmailResponse>> => {
    return fixturesEmail[scenario]
  },
}
