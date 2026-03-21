import type { ApiResponse, VerificacionEmailResponse } from '../../types/crearCuenta.types'

// En este escenario el registro falla, el email de verificación no se envía
const fixture: ApiResponse<VerificacionEmailResponse> = {
  status: 400,
  error: 'No se puede enviar verificación para un registro fallido',
}

export default fixture
