import { useCrearCuenta } from '../hooks/useCrearCuenta'
import type { CrearCuentaFormData } from '../types/crearCuenta.types'

function Field({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  error,
  disabled,
  onChange,
}: {
  id: keyof CrearCuentaFormData
  label: string
  type?: string
  value: string
  placeholder: string
  error?: string
  disabled: boolean
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className={`
          w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 outline-none
          placeholder:text-gray-400 transition
          focus:ring-2 focus:ring-violet-500 focus:border-violet-500
          disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}
        `}
      />
      {error && (
        <p role="alert" className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

export function CrearCuentaForm() {
  const {
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
  } = useCrearCuenta()

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">¡Cuenta creada!</h2>
        <p className="text-sm text-gray-500">
          Bienvenido, <span className="font-medium text-gray-700">{cuenta?.nombre}</span>.
          Revisa tu email para verificar tu cuenta.
        </p>
      </div>
    )
  }

  if (isEmailError) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Cuenta creada</h2>
        <p className="text-sm text-gray-500 mb-6">{emailVerificacionError}</p>
        <button
          onClick={reintentarEmail}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2.5 rounded-lg transition cursor-pointer"
        >
          Reenviar email de verificación
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900">Crear cuenta</h1>
        <p className="text-sm text-gray-500 mt-1">Completa los datos para registrarte</p>
      </div>

      <form onSubmit={e => { e.preventDefault(); registrar() }} className="flex flex-col gap-4">
        <Field
          id="nombre"
          label="Nombre"
          value={formData.nombre}
          placeholder="Tu nombre"
          error={errors.nombre}
          disabled={isLoading}
          onChange={v => updateField('nombre', v)}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          placeholder="tu@email.com"
          error={errors.email}
          disabled={isLoading}
          onChange={v => updateField('email', v)}
        />
        <Field
          id="password"
          label="Contraseña"
          type="password"
          value={formData.password}
          placeholder="••••••••"
          error={errors.password}
          disabled={isLoading}
          onChange={v => updateField('password', v)}
        />

        {errors.general && (
          <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3.5 py-3">
            <span className="mt-0.5">⚠</span>
            <span>{errors.general}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-medium py-2.5 rounded-lg transition mt-1 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creando cuenta...
            </span>
          ) : 'Crear cuenta'}
        </button>
      </form>
    </div>
  )
}
