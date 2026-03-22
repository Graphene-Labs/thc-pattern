# Patrón THC / THC-C

Basado en el [Patrón JONA](https://github.com/Jofrantoba-Coding/patron-frontend-jona--) creado por Jonathan Franchesco Torres Baca.

---

## ¿Por qué existe este patrón?

Cuando desarrollamos un feature de frontend siempre terminamos necesitando las mismas tres cosas: un lugar donde definir los datos, un lugar donde vivir la lógica, y un lugar donde construir la UI. No importa el proyecto, no importa el equipo — esas tres responsabilidades siempre están.

El problema es que en la práctica o no hay estructura y todo termina mezclado en el componente, o se adopta una arquitectura tan compleja que nadie la entiende ni la mantiene. Un feature simple no debería necesitar ocho archivos y tres capas de abstracción.

THC propone lo mínimo necesario: tres capas con nombres que mapean directamente a las herramientas que ya usamos. **Types** para los datos, **Hooks** para la lógica, **Components** para la UI. De ahí el nombre.

La segunda necesidad que resuelve el patrón es el desarrollo en paralelo. Cuando el maquetador necesita trabajar sin depender de que el backend esté listo, hace falta un mecanismo para intercambiar entre la implementación real y un mock. Esa necesidad da origen a la variante **THC-C**, que agrega el Composer como capa de intercambio.

---

## Premisa fundamental

> THC no organiza proyectos. Organiza features.

Este patrón no reemplaza tu arquitectura macro. No compite con Feature Slicing, Hexagonal, ni ninguna otra estructura a nivel de proyecto. THC vive dentro de esas estructuras y se encarga de organizar las piezas pequeñas: un formulario, un flujo, una pantalla, un módulo específico.

---

## Las dos versiones del patrón

### THC — Types · Hooks · Components

La versión base. Tres capas, pensada para features simples o para el punto de partida de cualquier feature. Sin fricción, sin boilerplate innecesario. Para la mayoría de los features es suficiente.

### THC-C — Types · Hooks · Composer · Components

La variante extendida. Se agrega el Composer cuando el equipo necesita que el maquetador trabaje sin depender del backend, probando múltiples escenarios de forma independiente.

La pregunta para decidir cuál usar es simple: ¿el maquetador necesita trabajar sin depender de la API real, jugando con distintos escenarios y distintos servicios? Si la respuesta es sí, el feature necesita THC-C.

---

## THC — Las tres capas base

Estas tres capas siempre están presentes, en THC y en THC-C.

### 1. Types — Contratos y entidades

Define la forma de los datos. Interfaces, entidades, tipos de request y response. Sin lógica, sin llamadas, sin renderizado. Puede vivir como dependencia (node modules, librerías) o en el tipado interno del feature.

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

// types/Cuenta.entity.ts
export interface Cuenta {
  id: string
  nombre: string
  email: string
  createdAt: string
}

// utils/api.response.ts
export interface ApiSuccessResponse<T> {
  status: 200 | 201
  data: T
}

export interface ApiErrorResponse {
  status: 400 | 401 | 409 | 500
  error: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
```

### 2. Hooks — Implementación y lógica de negocio

El hook es el orquestador del feature. Maneja estado, validaciones, llamadas a servicios y transformaciones de datos.

> El componente no sabe cómo funciona el negocio. El hook no sabe cómo se ve la pantalla. Esa separación es la clave del patrón.

A medida que el feature crece, el hook puede delegar responsabilidades a capas adicionales debajo de él: services, repositories, mappers, validators. El hook sigue siendo el orquestador — los componentes nunca tocan esas capas directamente.

```ts
// hooks/useCrearCuenta.ts
import { useState } from 'react'
import { registrarService } from './registrarComposedService'
import type { CrearCuentaFormData, CrearCuentaErrors, ApiResponse, Cuenta } from '@/types/crearCuenta.types'

const initialFormData: CrearCuentaFormData = { nombre: '', email: '', password: '' }

export function useCrearCuenta() {
  const [formData, setFormData] = useState<CrearCuentaFormData>(initialFormData)
  const [errors, setErrors] = useState<CrearCuentaErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError   = status === 'error'

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

  return { formData, errors, status, isLoading, isSuccess, isError, updateField, registrar }
}
```

**Alternativa con TanStack Query** — `isPending`, `isSuccess` y el manejo de errores vienen de la librería. El hook se reduce al estado del formulario.

```ts
// hooks/useCrearCuenta.ts
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { registrarService } from './registrarComposedService'
import type { CrearCuentaFormData, CrearCuentaErrors, ApiResponse, Cuenta } from '@/types/crearCuenta.types'

const initialFormData: CrearCuentaFormData = { nombre: '', email: '', password: '' }

export function useCrearCuenta() {
  const [formData, setFormData] = useState<CrearCuentaFormData>(initialFormData)
  const [errors, setErrors] = useState<CrearCuentaErrors>({})

  const updateField = (field: keyof CrearCuentaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const { mutate: registrar, isPending: isLoading, isSuccess } = useMutation<
    ApiResponse<Cuenta>,
    Error,
    CrearCuentaFormData
  >({
    mutationFn: registrarService,
    onSuccess: (result) => {
      if (result.status !== 200 && result.status !== 201) {
        setErrors({ general: (result as ApiErrorResponse).error })
      }
    },
    onError: (error) => setErrors({ general: error.message }),
  })

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    updateField,
    registrar: () => registrar(formData),
  }
}
```

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
      <input
        value={formData.nombre}
        onChange={e => updateField('nombre', e.target.value)}
        placeholder="Nombre"
      />
      {errors.nombre && <span>{errors.nombre}</span>}

      <input
        type="email"
        value={formData.email}
        onChange={e => updateField('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email}</span>}

      {errors.general && <span>{errors.general}</span>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Crear cuenta'}
      </button>
    </form>
  )
}
```

---

## THC-C — El Composer

El Composer es la cuarta capa. Es el punto de intercambio entre la implementación real y el mock. El hook no sabe qué hay del otro lado — importa una función o un servicio y lo usa. Lo que hay detrás lo decide el Composer.

### El problema que resuelve

Cuando el producto depende de varios servicios con flujos complejos, es difícil reproducir todos los escenarios en desarrollo. No siempre se puede pedirle a la base de datos que tenga un estado específico. El maquetador no debería estar bloqueado esperando que el backend esté listo.

El Composer desacopla esas dependencias. El maquetador navega flujos completos — éxito, errores, casos edge — con datos estructurados y realistas, sin tocar la API real.

### Fixtures por escenario

Cada escenario es una carpeta. Dentro, un archivo por servicio. Los fixtures están tipados con la entidad — si el tipo cambia, TypeScript detecta qué fixtures están desactualizados en compilación.

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
  data: {
    id: 'usr_abc123',
    nombre: 'María García',
    email: 'maria@ejemplo.com',
    createdAt: '2025-01-15T10:30:00Z',
  },
}

export default fixture
```

```ts
// fixtures/emailDuplicado/crearCuenta.fixture.ts
import type { ApiResponse, Cuenta } from '@/types/crearCuenta.types'

const fixture: ApiResponse<Cuenta> = {
  status: 409,
  error: 'Este email ya está registrado',
}

export default fixture
```

Cambiar de escenario es cambiar una constante en el Composer. Cero cambios en el hook, cero cambios en el componente.

---

### THC-C Variante A — sin capa de servicios

Para features simples. El Composer vive dentro de `hooks/` e intercambia una función suelta. El hook importa esa función sin saber si va a la API o al fixture.

```
hooks/
  registrarComposedService.ts   ← Composer: switch de funciones
  useCrearCuenta.ts             ← importa registrarService, no sabe qué hay
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
  const response = await fetch('/api/crear-cuenta', {
    method: 'POST',
    body: JSON.stringify(data),
  })
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

Para features con múltiples endpoints. El Composer vive en `services/` e intercambia el objeto de servicio completo. Todos los métodos se intercambian de una vez.

```
services/
  crearCuentaService.ts         ← implementación real
  crearCuentaService.mock.ts    ← devuelve fixtures tipados
  composer.ts                   ← switch de servicios
hooks/
  useCrearCuenta.ts             ← importa de services/composer
fixtures/
  exitoso/crearCuenta.fixture.ts
  emailDuplicado/crearCuenta.fixture.ts
```

**`composeConfig.ts`** — a nivel global, fuera de features. Controla qué features usan mock y qué escenario activo tienen.

```ts
// @config/composeConfig.ts
export const composeConfig = {
  register: {
    useMock: true,
    scenario: 'exitoso',
  },
  login: {
    useMock: false,
    scenario: 'exitoso',
  },
} as const

export type FeatureKey = keyof typeof composeConfig
```

```ts
// services/crearCuentaService.ts
import type { CrearCuentaFormData, ApiResponse, Cuenta } from '@/types/crearCuenta.types'

export const crearCuentaService = {
  registrar: async (data: CrearCuentaFormData): Promise<ApiResponse<Cuenta>> => {
    const response = await fetch('/api/crear-cuenta', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },
}
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

```ts
// hooks/useCrearCuenta.ts
import { useState } from 'react'
import { crearCuentaService } from '../services/composer'
import type { CrearCuentaFormData, CrearCuentaErrors, ApiResponse, Cuenta } from '@/types/crearCuenta.types'

const initialFormData: CrearCuentaFormData = { nombre: '', email: '', password: '' }

export function useCrearCuenta() {
  const [formData, setFormData] = useState<CrearCuentaFormData>(initialFormData)
  const [errors, setErrors] = useState<CrearCuentaErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError   = status === 'error'

  const updateField = (field: keyof CrearCuentaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const registrar = async () => {
    setStatus('loading')
    const result: ApiResponse<Cuenta> = await crearCuentaService.registrar(formData)
    if (result.status === 200 || result.status === 201) {
      setStatus('success')
    } else {
      setErrors({ general: result.error })
      setStatus('error')
    }
  }

  return { formData, errors, status, isLoading, isSuccess, isError, updateField, registrar }
}
```

---

## Capas opcionales

Se agregan cuando el feature las necesita. Nunca desde el inicio.

- **Debajo de Hooks**: `services/`, `repositories/`, `mappers/`, `validators/`, `utils/`
- **Debajo de Components**: `store/` cuando el feature necesita estado compartido entre componentes distantes o entre features

El hook sigue siendo el orquestador en todos los casos. Los componentes nunca acceden a estas capas directamente.

### Store — alternativa A con Zustand

```ts
// store/cuentaStore.ts
import { create } from 'zustand'
import type { Cuenta } from '@/types/crearCuenta.types'

interface CuentaStore {
  cuenta: Cuenta | null
  setCuenta: (cuenta: Cuenta) => void
  clearCuenta: () => void
}

export const useCuentaStore = create<CuentaStore>(set => ({
  cuenta: null,
  setCuenta: (cuenta) => set({ cuenta }),
  clearCuenta: () => set({ cuenta: null }),
}))
```

### Store — alternativa B con TanStack Store

Encaja de forma natural si el proyecto ya usa TanStack Query. Todo viene del mismo ecosistema.

```ts
// store/cuentaStore.ts
import { Store } from '@tanstack/store'
import type { Cuenta } from '@/types/crearCuenta.types'

export const cuentaStore = new Store<{ cuenta: Cuenta | null }>({ cuenta: null })

export const setCuenta = (cuenta: Cuenta) =>
  cuentaStore.setState(() => ({ cuenta }))

export const clearCuenta = () =>
  cuentaStore.setState(() => ({ cuenta: null }))
```

Zustand es más maduro y tiene mayor ecosistema. TanStack Store es la elección natural si el proyecto ya usa TanStack Query — reduce dependencias externas y comparte la misma filosofía reactiva.

---

## Escalado gradual

El patrón empieza simple y crece solo cuando es necesario. No hay que anticipar complejidad ni construir abstracciones de entrada.

**Nivel 1 — THC básico**
Tres archivos. Suficiente para la mayoría de los casos.
```
types/crearCuenta.types.ts
hooks/useCrearCuenta.ts
components/CrearCuentaForm.tsx
```

**Nivel 2 — THC-C variante A, un escenario**
Cuando el maquetador necesita trabajar sin backend.
```
types/crearCuenta.types.ts
hooks/registrarComposedService.ts
hooks/useCrearCuenta.ts
fixtures/exitoso/crearCuenta.fixture.ts
components/CrearCuentaForm.tsx
```

**Nivel 3 — THC-C variante A, múltiples escenarios**
Cuando se necesitan múltiples escenarios configurables.
```
types/crearCuenta.types.ts
hooks/registrarComposedService.ts
hooks/useCrearCuenta.ts
fixtures/exitoso/crearCuenta.fixture.ts
fixtures/emailDuplicado/crearCuenta.fixture.ts
fixtures/errorServidor/crearCuenta.fixture.ts
components/CrearCuentaForm.tsx
```

**Nivel 4 — THC-C variante B con servicios y composeConfig**
Cuando el feature es complejo y necesita separar servicios.
```
composeConfig.ts                          ← global
types/crearCuenta.types.ts
services/crearCuentaService.ts
services/crearCuentaService.mock.ts
services/composer.ts
hooks/useCrearCuenta.ts
fixtures/[escenario]/crearCuenta.fixture.ts
components/CrearCuentaForm.tsx
```

**Nivel 5 — THC-C completo con store y capas opcionales**
Cuando el feature es complejo y necesita todas las capas.
```
composeConfig.ts
types/crearCuenta.types.ts
types/cuenta.entity.ts
validators/crearCuentaValidator.ts
mappers/crearCuentaMapper.ts
services/crearCuentaService.ts
services/crearCuentaService.mock.ts
services/composer.ts
store/cuentaStore.ts
hooks/useCrearCuenta.ts
fixtures/[escenario]/crearCuenta.fixture.ts
components/CrearCuentaForm.tsx
```

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

| Variante | Cuándo usarla |
|----------|---------------|
| THC | Feature simple, equipo con acceso al backend, primeras iteraciones |
| THC-C variante A | Maquetador necesita trabajar sin backend, uno o pocos endpoints |
| THC-C variante B | Múltiples endpoints, lógica de servicio compleja, control centralizado con `composeConfig` |

El patrón aplica en React, Vue, Alpine y cualquier librería moderna basada en componentes y hooks funcionales. No aplica en Angular, donde la inyección de dependencias nativa impone una estructura diferente.

---

## THC-C en la célula ágil: proceso con BDD

THC-C encaja de forma natural con BDD cuando se aplica desde la fase de planificación. El proceso conecta los criterios de aceptación de QA con los fixtures del Composer: cada caso del Test Plan tiene su carpeta de fixtures, y el maquetador puede probar ese escenario exacto cambiando una constante.

### Roles

| Rol | Responsabilidad |
|-----|----------------|
| Back | Expone los contratos de las APIs y los publica en Swagger |
| Back Apoyo | Apoya al equipo frontend con dudas sobre contratos, tiene acceso al ambiente de desarrollo |
| Front IMP | Implementa hooks y servicios reales, co-construye los fixtures con QA |
| Front GUI | Maqueta la UI contra los mocks, no depende del backend para trabajar |
| QA | Escribe las HUs con criterios BDD, estructura el Test Plan, co-construye los fixtures con Front IMP |

### Flujo general

**Planificación**
- Back → publica Swagger con endpoints y todos los códigos de respuesta
- QA → escribe HUs y Test Plan en formato BDD
- Front IMP → genera los archivos `.types.ts` y entidades desde el Swagger

**Inicio del desarrollo**
- QA + Front IMP → construyen los fixtures por escenario (una carpeta por caso hoja)
- QA + Front IMP → configuran el Composer apuntando al mock

**En paralelo (desbloqueado)**
- Front GUI → maqueta contra mocks, cambia escenario cambiando `SCENARIO` en el Composer
- Front IMP → implementa servicios y hooks reales contra el Swagger

**Integración**
- Front IMP → actualiza el Composer para apuntar a la implementación real
- QA → ejecuta los casos del Test Plan sobre la implementación real

El punto de sincronización crítico es tener los fixtures listos. Una vez que existen, el equipo trabaja en paralelo sin bloquearse.

### El Test Plan y su relación con los fixtures

El Test Plan se estructura en tres niveles: la vista o feature, los servicios que consume, y los casos por servicio. Cada caso hoja se convierte en una carpeta de fixtures.

```
Caso 1 — Vista: Crear cuenta
  Servicios relacionados:
    - POST /api/crear-cuenta
    - POST /api/enviar-verificacion-email

  Caso 1.1 — POST /api/crear-cuenta
    Caso 1.1.1 — Registro exitoso
      Given: el usuario completa todos los campos válidos
      When:  envía el formulario
      Then:  recibe confirmación y es redirigido al paso de verificación
      Response: 200

    Caso 1.1.2 — Email ya registrado
      Given: el usuario ingresa un email que ya existe
      When:  envía el formulario
      Then:  ve un mensaje de error indicando el email duplicado
      Response: 409 EMAIL_DUPLICADO

    Caso 1.1.3 — Error del servidor
      Given: el servicio no está disponible
      When:  el usuario envía el formulario
      Then:  ve un mensaje de error genérico
      Response: 500 SERVER_ERROR

  Caso 1.2 — POST /api/enviar-verificacion-email
    Caso 1.2.1 — Email enviado correctamente
      Given: el registro fue exitoso
      When:  el sistema intenta enviar el email de verificación
      Then:  el usuario ve la pantalla de confirmación
      Response: 200

    Caso 1.2.2 — Fallo en el envío
      Given: el servicio de email no está disponible
      When:  el sistema intenta enviar el email de verificación
      Then:  el usuario puede reintentar desde la pantalla de confirmación
      Response: 503 EMAIL_SERVICE_UNAVAILABLE
```

Los casos hoja (1.1.1, 1.1.2, 1.1.3, 1.2.1, 1.2.2) se traducen directamente en carpetas de fixtures:

```
fixtures/
  exitoso/
    crearCuenta.fixture.ts
    verificacionEmail.fixture.ts
  emailDuplicado/
    crearCuenta.fixture.ts
    verificacionEmail.fixture.ts
  errorServidor/
    crearCuenta.fixture.ts
    verificacionEmail.fixture.ts
  emailServiceUnavailable/
    crearCuenta.fixture.ts
    verificacionEmail.fixture.ts
```

Los fixtures están listos cuando existe una carpeta por cada caso hoja. Esa es la condición para que Front GUI empiece a maquetar.

### Reglas del proceso

1. **Los types vienen del Swagger, no se inventan.** Si hay discrepancia, el Swagger gana. La conversación se tiene con backend.
2. **Cada caso hoja del Test Plan tiene su carpeta de fixtures.** Un caso sin fixture es un escenario que la UI nunca fue probada.
3. **Los fixtures están tipados con la entidad.** Si el contrato cambia, TypeScript señala los fixtures rotos antes de que lleguen a producción.
4. **Los fixtures son realistas.** Datos vagos generan UIs que se ven bien en desarrollo y se rompen en producción.
5. **La Mock Library es un artefacto del equipo, no de Front IMP.** QA co-construye los fixtures porque son la traducción directa de los criterios de aceptación. Si QA no participó, los criterios y los mocks pueden estar desincronizados.
6. **El Composer siempre tiene un estado declarado.** En todo momento debe quedar claro si el feature está en modo mock o en modo real.

---

## Resumen

Tres capas siempre: Types define los datos, Hooks implementa la lógica, Components renderiza la UI.

THC-C agrega el Composer: un punto de intercambio que decide qué implementación entregar sin que el hook lo sepa. Los fixtures están tipados con la entidad — si el contrato cambia, TypeScript detecta qué fixtures están rotos. Los escenarios viven en carpetas: agregar uno nuevo es crear una carpeta, sin tocar ningún archivo existente.

Agregar complejidad al patrón es siempre aditivo. Nunca se rompe lo que ya existe.

---

## Origen

THC y THC-C son una evolución del [Patrón JONA (Joint Orchestrated N-layer Architecture)](https://github.com/Jofrantoba-Coding/patron-frontend-jona--) creado por Jonathan Franchesco Torres Baca.

JONA en su versión actual es un patrón conceptual agnóstico a la plataforma y al paradigma. Sus tres capas — Interface, Template e Implementation — aplican en TypeScript, Kotlin, Swift, Dart, C# o cualquier lenguaje que soporte contratos y abstracción. THC toma esa filosofía de separación y la especializa para el ecosistema de librerías reactivas modernas — React, Vue, Alpine — donde el paradigma dominante son los hooks y los componentes funcionales.

THC-C extiende THC con el Composer, una capa que surge de llevar la filosofía de JONA a su consecuencia natural en el desarrollo moderno. El Composer formaliza ese principio como una capa propia: un punto activo de decisión que determina en tiempo de ejecución qué implementación se entrega, permitiendo que la UI y la lógica de negocio se desarrollen verdaderamente en paralelo.
