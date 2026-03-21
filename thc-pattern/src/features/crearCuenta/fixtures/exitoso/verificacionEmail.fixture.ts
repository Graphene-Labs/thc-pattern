import type { ApiResponse, VerificacionEmailResponse } from '../../types/crearCuenta.types'

const fixture: ApiResponse<VerificacionEmailResponse> = {
  status: 200,
  data: {
    enviado: true,
  },
}

export default fixture
