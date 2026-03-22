import type { ApiResponse, Cuenta } from '../../types/crearCuenta.types'

const fixture: ApiResponse<Cuenta> = {
  status: 201,
  data: { id: 'usr_abc123', nombre: 'María García', email: 'maria@ejemplo.com', createdAt: '2025-01-15T10:30:00Z' },
}

export default fixture
