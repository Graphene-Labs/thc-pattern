import { composeConfig } from '../../../config/composeConfig'
import { crearCuentaService as real } from './crearCuentaService'
import { crearCuentaService as mock } from './crearCuentaService.mock'

export const crearCuentaService = composeConfig.crearCuenta.useMock ? mock : real
