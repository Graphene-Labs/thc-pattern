import { useCrearCuenta } from '../hooks/useCrearCuenta'

export function CrearCuentaForm() {
  const { formData, errors, isLoading, isSuccess, updateField, registrar } = useCrearCuenta()

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">¡Cuenta creada!</h2>
        <p className="text-sm text-gray-500">Revisa tu email para verificar tu cuenta.</p>
      </div>
    )
  }

  return (
    <form onSubmit={e => { e.preventDefault(); registrar() }} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="n2-nombre" className="text-sm font-medium text-gray-700">Nombre</label>
        <input id="n2-nombre" value={formData.nombre} onChange={e => updateField('nombre', e.target.value)}
          placeholder="Tu nombre" disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50" />
        {errors.nombre && <p role="alert" className="text-xs text-red-500">⚠ {errors.nombre}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="n2-email" className="text-sm font-medium text-gray-700">Email</label>
        <input id="n2-email" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)}
          placeholder="tu@email.com" disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50" />
        {errors.email && <p role="alert" className="text-xs text-red-500">⚠ {errors.email}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="n2-password" className="text-sm font-medium text-gray-700">Contraseña</label>
        <input id="n2-password" type="password" value={formData.password} onChange={e => updateField('password', e.target.value)}
          placeholder="••••••••" disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-50" />
        {errors.password && <p role="alert" className="text-xs text-red-500">⚠ {errors.password}</p>}
      </div>
      {errors.general && (
        <div role="alert" className="flex gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3.5 py-3">
          <span>⚠</span><span>{errors.general}</span>
        </div>
      )}
      <button type="submit" disabled={isLoading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-medium py-2.5 rounded-lg transition cursor-pointer disabled:cursor-not-allowed">
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  )
}
