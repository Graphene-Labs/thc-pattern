import { useState } from 'react'
import { crearCuentaService } from '../services/composer'
import { validarCrearCuenta, tieneErrores } from '../validators/crearCuentaValidator'
import { useCuentaStore } from '../store/cuentaStore'
import type {
  CrearCuentaFormData,
  CrearCuentaErrors,
  ApiResponse,
  Cuenta,
  ApiSuccessResponse,
  ApiErrorResponse,
  VerificacionEmailResponse,
} from '../types/crearCuenta.types'

type Status = 'idle' | 'loading' | 'success' | 'emailError'

const initialFormData: CrearCuentaFormData = { nombre: '', email: '', password: '' }

export function useCrearCuenta() {
  const [formData, setFormData] = useState<CrearCuentaFormData>(initialFormData)
  const [errors, setErrors] = useState<CrearCuentaErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [emailVerificacionError, setEmailVerificacionError] = useState<string | null>(null)

  const { cuenta, setCuenta } = useCuentaStore()

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isEmailError = status === 'emailError'

  const updateField = (field: keyof CrearCuentaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const registrar = async () => {
    // Validación local antes de llamar al servicio
    const validationErrors = validarCrearCuenta(formData)
    if (tieneErrores(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    setStatus('loading')
    setErrors({})

    const registroResult: ApiResponse<Cuenta> = await crearCuentaService.registrar(formData)

    if (registroResult.status !== 200 && registroResult.status !== 201) {
      setErrors({ general: (registroResult as ApiErrorResponse).error })
      setStatus('idle')
      return
    }

    const cuentaCreada = (registroResult as ApiSuccessResponse<Cuenta>).data
    setCuenta(cuentaCreada)

    const emailResult: ApiResponse<VerificacionEmailResponse> =
      await crearCuentaService.enviarVerificacionEmail(cuentaCreada.email)

    if (emailResult.status !== 200 && emailResult.status !== 201) {
      setEmailVerificacionError((emailResult as ApiErrorResponse).error)
      setStatus('emailError')
      return
    }

    setStatus('success')
  }

  const reintentarEmail = async () => {
    if (!cuenta) return
    setEmailVerificacionError(null)
    setStatus('loading')

    const emailResult: ApiResponse<VerificacionEmailResponse> =
      await crearCuentaService.enviarVerificacionEmail(cuenta.email)

    if (emailResult.status !== 200 && emailResult.status !== 201) {
      setEmailVerificacionError((emailResult as ApiErrorResponse).error)
      setStatus('emailError')
      return
    }

    setStatus('success')
  }

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    isEmailError,
    emailVerificacionError,
    cuenta,
    updateField,
    registrar,
    reintentarEmail,
  }
}
