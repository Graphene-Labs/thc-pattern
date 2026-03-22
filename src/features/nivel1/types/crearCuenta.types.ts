export interface CrearCuentaFormData {
  nombre: string
  email: string
  password: string
}

export interface CrearCuentaErrors {
  nombre?: string
  email?: string
  password?: string
  general?: string
}

export interface Cuenta {
  id: string
  nombre: string
  email: string
  createdAt: string
}

export interface ApiSuccessResponse<T> { status: 200 | 201; data: T }
export interface ApiErrorResponse { status: 400 | 401 | 409 | 500; error: string; code?: string }
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
