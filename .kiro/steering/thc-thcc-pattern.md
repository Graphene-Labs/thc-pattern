---
inclusion: always
---

# Patrón THC / THC-C

Basado en el Patrón JONA (Jonathan Franchesco Torres Baca). Organiza **features**, no proyectos. Convive con cualquier arquitectura macro (Feature Slicing, Hexagonal, Clean Architecture).

## Premisa

THC no reemplaza la arquitectura del proyecto. Organiza las piezas pequeñas: un formulario, un flujo, una pantalla, un módulo específico.

---

## THC — Las tres capas base

Siempre presentes, en THC y en THC-C.

### 1. Types — Contratos y entidades

Define la forma de los datos. Sin lógica, sin llamadas, sin renderizado. Puede venir de node_modules o vivir en el tipado interno del feature.

```ts
// types/crearCuenta.types.ts
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

export interface ApiSuccessResponse<T> { status: 200 | 201; data: T }
export interface ApiErrorResponse { status: 400 | 401 | 409 | 500; error: string }
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
```

### 2. Hooks — Implementación y lógica de negocio

El hook es el orquestador del feature. Maneja estado, validaciones, llamadas a servicios y transformaciones. El componente no sabe cómo funciona el negocio. El hook no sabe cómo se ve la pantalla.

A medida que el feature crece, el hook puede delegar a capas adicionales (services, repositories, mappers, validators). Los componentes nunca tocan esas capas directamente.

```ts
// hooks/useCrearCuenta.ts
import { useState } from 'react'
import { registrarService } from './registrarComposedService'
import type { CrearCuentaFormData, CrearCuentaErrors, ApiResponse, Cuenta } from '@/types/crearCuenta.types'

export function useCrearCuenta() {
  const [formData, setFormData] = useState<CrearCuentaFormData>({ nombre: '', email: '', password: '' })
  const [errors, setErrors] = useState<CrearCuentaErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const updateField = (field: keyof CrearCuentaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const registrar = async () => {
    setStatus('loading')
    const result: ApiResponse<Cuenta> = await registrarService(formData)
    if (result.status === 200 || result.status === 201) {
      setStatus('success')
    } else {
      setErrors({ general: result.error })
      setStatus('error')
    }
  }

  return { formData, errors, status, isLoading: status === 'loading', isSuccess: status === 'success', isError: status === 'error', updateField, registrar }
}
```

Con TanStack Query: `isPending`, `isSuccess` y manejo de errores vienen de la librería; el hook se reduce al estado del formulario.

### 3. Components — Interfaz de usuario

Renderiza y captura interacciones. Sin lógica de negocio, sin llamadas directas a servicios. El componente no cambia entre THC y THC-C.

```tsx
// components/CrearCuentaForm.tsx
import { useCrearCuenta } from '../hooks/useCrearCuenta'

export function CrearCuentaForm() {
  const { formData, errors, isLoading, isSuccess, updateField, registrar } = useCrearCuenta()
  if (isSuccess) return <p>Cuenta creada correctamente</p>
  return (
    <form onSubmit={e => { e.preventDefault(); registrar() }}>
      <input value={formData.nombre} onChange={e => updateField('nombre', e.target.value)} placeholder="Nombre" />
      {errors.nombre && <span>{errors.nombre}</span>}
      <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="Email" />
      {errors.email && <span>{errors.email}</span>}
      {errors.general && <span>{errors.general}</span>}
      <button type="submit" disabled={isLoading}>{isLoading ? 'Registrando...' : 'Crear cuenta'}</button>
    </form>
  )
}
```

---

## THC-C — El Composer

Se agrega cuando el maquetador necesita trabajar sin depender del backend, probando múltiples escenarios de forma independiente.

El Composer es el punto de intercambio entre la implementación real y el mock. El hook importa una función o servicio sin saber qué hay detrás.

### Fixtures por escenario

Cada escenario es una carpeta. Cada archivo de fixture está tipado con la entidad — si el tipo cambia, TypeScript detecta los fixtures desactualizados en compilación.

```
fixtures/
  exitoso/
    crearCuenta.fixture.ts
  emailDuplicado/
    crearCuenta.fixture.ts
  errorServidor/
    crearCuenta.fixture.ts
```

```ts
// fixtures/exitoso/crearCuenta.fixture.ts
import type { ApiResponse, Cuenta } from '@/types/crearCuenta.types'
const fixture: ApiResponse<Cuenta> = {
  status: 201,
  data: { id: 'usr_abc123', nombre: 'María García', email: 'maria@ejemplo.com', createdAt: '2025-01-15T10:30:00Z' },
}
export default fixture
```

Cambiar de escenario es cambiar una constante en el Composer. Cero cambios en el hook, cero cambios en el componente.

---

### THC-C Variante A — sin capa de servicios

Para features simples. El Composer vive dentro de `hooks/` e intercambia una función suelta.

```
hooks/
  registrarComposedService.ts   ← Composer
  useCrearCuenta.ts
fixtures/
  exitoso/crearCuenta.fixture.ts
  emailDuplicado/crearCuenta.fixture.ts
```

```ts
// hooks/registrarComposedService.ts
import type { CrearCuentaFormData, ApiResponse, Cuenta } from '@/types/crearCuenta.types'

const USE_MOCK = true
const SCENARIO = 'exitoso'

const registrarReal = async (data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
  const response = await fetch('/api/crear-cuenta', { method: 'POST', body: JSON.stringify(data) })
  return response.json()
}

const registrarMock = async (_data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
  const { default: fixture } = await import(`@/fixtures/${SCENARIO}/crearCuenta.fixture`)
  return fixture
}

export const registrarService = USE_MOCK ? registrarMock : registrarReal
```

---

### THC-C Variante B — con capa de servicios

Para features con múltiples endpoints. El Composer vive en `services/` e intercambia el objeto de servicio completo.

```
composeConfig.ts                    ← global, fuera del feature
services/
  crearCuentaService.ts
  crearCuentaService.mock.ts
  composer.ts
hooks/
  useCrearCuenta.ts
fixtures/
  exitoso/crearCuenta.fixture.ts
```

```ts
// @config/composeConfig.ts
export const composeConfig = {
  register: { useMock: true, scenario: 'exitoso' },
  login:    { useMock: false, scenario: 'exitoso' },
} as const
export type FeatureKey = keyof typeof composeConfig
```

```ts
// services/crearCuentaService.mock.ts
import { composeConfig } from '@/composeConfig'
import type { CrearCuentaFormData, ApiResponse, Cuenta } from '@/types/crearCuenta.types'
const { scenario } = composeConfig.register
export const crearCuentaService = {
  registrar: async (_data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
    const { default: fixture } = await import(`@/fixtures/${scenario}/crearCuenta.fixture`)
    return fixture
  },
}
```

```ts
// services/composer.ts
import { composeConfig } from '@/composeConfig'
import { crearCuentaService as real } from './crearCuentaService'
import { crearCuentaService as mock } from './crearCuentaService.mock'
export const crearCuentaService = composeConfig.register.useMock ? mock : real
```

---

## Capas opcionales

Se agregan cuando el feature las necesita. Nunca desde el inicio.

- Debajo de Hooks: `services/`, `repositories/`, `mappers/`, `validators/`, `utils/`
- Debajo de Components: `store/` cuando se necesita estado compartido entre componentes distantes o entre features

El hook sigue siendo el orquestador. Los componentes nunca acceden a estas capas directamente.

### Store con Zustand

```ts
// store/cuentaStore.ts
import { create } from 'zustand'
import type { Cuenta } from '@/types/crearCuenta.types'
interface CuentaStore { cuenta: Cuenta | null; setCuenta: (c: Cuenta) => void; clearCuenta: () => void }
export const useCuentaStore = create<CuentaStore>(set => ({
  cuenta: null,
  setCuenta: (cuenta) => set({ cuenta }),
  clearCuenta: () => set({ cuenta: null }),
}))
```

### Store con TanStack Store

Elección natural si el proyecto ya usa TanStack Query — reduce dependencias externas y comparte la misma filosofía reactiva.

```ts
// store/cuentaStore.ts
import { Store } from '@tanstack/store'
import type { Cuenta } from '@/types/crearCuenta.types'
export const cuentaStore = new Store<{ cuenta: Cuenta | null }>({ cuenta: null })
export const setCuenta = (cuenta: Cuenta) => cuentaStore.setState(() => ({ cuenta }))
export const clearCuenta = () => cuentaStore.setState(() => ({ cuenta: null }))
```

---

## Escalado gradual

El patrón empieza simple y crece solo cuando es necesario.

| Nivel | Descripción | Archivos clave |
|-------|-------------|----------------|
| 1 | THC básico | `types/`, `hooks/use[Feature].ts`, `components/` |
| 2 | THC-C variante A, un escenario | + `hooks/[metodo]ComposedService.ts`, `fixtures/exitoso/` |
| 3 | THC-C variante A, múltiples escenarios | + carpetas de fixtures por escenario |
| 4 | THC-C variante B con servicios | + `services/`, `composeConfig.ts` global |
| 5 | THC-C completo con store y capas opcionales | + `store/`, `validators/`, `mappers/` |

Agregar escenarios nuevos nunca aumenta la complejidad del patrón. Solo se agrega una carpeta de fixtures.

---

## Estructura de carpetas recomendada

```
[feature]/
├── types/
│   ├── [feature].types.ts
│   └── [entidad].entity.ts
├── hooks/
│   ├── use[Feature].ts
│   └── [metodo]ComposedService.ts    (THC-C variante A)
├── services/                          (THC-C variante B)
│   ├── [feature]Service.ts
│   ├── [feature]Service.mock.ts
│   └── composer.ts
├── store/                             (opcional)
│   └── [entidad]Store.ts
├── validators/                        (opcional)
├── mappers/                           (opcional)
├── fixtures/                          (THC-C)
│   ├── exitoso/
│   │   └── [feature].fixture.ts
│   └── [escenario]/
│       └── [feature].fixture.ts
├── components/
│   └── [Feature]Form.tsx
└── [feature].tsx

composeConfig.ts                       (THC-C variante B, nivel global)
```

---

## Cuándo usar cada variante

- **THC**: feature simple, equipo con acceso al backend, primeras iteraciones.
- **THC-C variante A**: maquetador necesita trabajar sin backend, feature con uno o pocos endpoints.
- **THC-C variante B**: feature con múltiples endpoints, lógica de servicio compleja, o necesidad de control centralizado con `composeConfig`.

El patrón aplica en React, Vue, Alpine y cualquier librería moderna basada en componentes y hooks funcionales. No aplica en Angular.
