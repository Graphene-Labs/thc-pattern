import { useState } from 'react'
import type { CrearCuentaFormData, CrearCuentaErrors, ApiResponse, Cuenta, ApiErrorResponse } from '../types/crearCuenta.types'

const initialFormData: CrearCuentaFormData = { nombre: '', email: '', password: '' }

export function useCrearCuenta() {
  const [formData, setFormData] = useState<CrearCuentaFormData>(initialFormData)
  const [errors, setErrors] = useState<CrearCuentaErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  const updateField = (field: keyof CrearCuentaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const registrar = async () => {
    setStatus('loading')
    setErrors({})

    // Llamada directa a la API — sin Composer, sin mock
    const response = await fetch('/api/crear-cuenta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const result: ApiResponse<Cuenta> = await response.json()

    if (result.status === 200 || result.status === 201) {
      setStatus('success')
    } else {
      setErrors({ general: (result as ApiErrorResponse).error })
      setStatus('error')
    }
  }

  return { formData, errors, isLoading, isSuccess, updateField, registrar }
}
