import type { ApiResponse, Cuenta } from '../../types/crearCuenta.types'

const fixture: ApiResponse<Cuenta> = {
  status: 500,
  error: 'Error interno del servidor. Intenta nuevamente más tarde.',
  code: 'SERVER_ERROR',
}

export default fixture
