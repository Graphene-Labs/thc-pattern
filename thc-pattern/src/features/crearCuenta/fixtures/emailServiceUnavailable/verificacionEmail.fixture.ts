import type { ApiResponse, VerificacionEmailResponse } from '../../types/crearCuenta.types'

const fixture: ApiResponse<VerificacionEmailResponse> = {
  status: 503,
  error: 'El servicio de email no está disponible. Puedes reintentarlo más tarde.',
  code: 'EMAIL_SERVICE_UNAVAILABLE',
}

export default fixture
