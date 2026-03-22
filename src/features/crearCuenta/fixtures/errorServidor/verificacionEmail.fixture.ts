import type { ApiResponse, VerificacionEmailResponse } from '../../types/crearCuenta.types'

const fixture: ApiResponse<VerificacionEmailResponse> = {
  status: 500,
  error: 'Error interno del servidor. Intenta nuevamente más tarde.',
  code: 'SERVER_ERROR',
}

export default fixture
