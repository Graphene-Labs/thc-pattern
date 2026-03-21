import type { ApiResponse, Cuenta } from '../../types/crearCuenta.types'

// El registro fue exitoso, pero el servicio de email falló al enviar la verificación
const fixture: ApiResponse<Cuenta> = {
  status: 201,
  data: {
    id: 'usr_def456',
    nombre: 'Carlos López',
    email: 'carlos@ejemplo.com',
    createdAt: '2025-01-15T11:00:00Z',
  },
}

export default fixture
