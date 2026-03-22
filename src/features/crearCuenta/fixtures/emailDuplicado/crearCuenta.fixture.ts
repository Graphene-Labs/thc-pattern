import type { ApiResponse, Cuenta } from '../../types/crearCuenta.types'

const fixture: ApiResponse<Cuenta> = {
  status: 409,
  error: 'Este email ya está registrado',
  code: 'EMAIL_DUPLICADO',
}

export default fixture
