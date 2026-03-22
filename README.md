# THC / THC-C Pattern

> Based on the JONA Pattern by Jonathan Franchesco Torres Baca

---

## Why does this pattern exist?

When building a frontend feature, you always end up needing the same three things: a place to define data, a place to hold logic, and a place to build the UI. It doesn't matter the project, it doesn't matter the team — those three responsibilities are always there.

The problem in practice is that either there's no structure at all and everything ends up mixed inside the component, or a complex architecture is adopted that nobody understands or maintains. A simple feature shouldn't need eight files and three layers of abstraction.

THC proposes the bare minimum: three layers named after the tools we already use. **Types** for data, **Hooks** for logic, **Components** for the UI. That's where the name comes from.

The second problem the pattern solves is parallel development. When the UI builder needs to work without waiting for the backend to be ready, you need a mechanism to swap between the real implementation and a mock. That need gives rise to the **THC-C** variant, which adds the **Composer** as an interchange layer.

---

## Core premise

**THC does not organize projects. It organizes features.**

It doesn't replace your macro architecture. It doesn't compete with Feature Slicing, Hexagonal, or any other project-level structure. THC lives inside those structures and organizes the small pieces: a form, a flow, a screen.

---

## The two variants

### THC — Types · Hooks · Components

The base variant. Three layers, three minimum files. Sufficient for most features.

### THC-C — Types · Hooks · Composer · Components

The extended variant. The Composer is added when the team needs the UI builder to work without depending on the backend, testing multiple scenarios independently.

---

## The three base layers

Present in both THC and THC-C.

### 1. Types — data and contracts

Defines the shape of data. Interfaces, entities, request and response types. No logic, no calls, no rendering.

In its simplest form, a single file with the feature's internal types is enough:

```ts
// types/createAccount.types.ts

export interface CreateAccountFormData {
  name: string
  email: string
  password: string
}

export interface CreateAccountErrors {
  name?: string
  email?: string
  password?: string
  general?: string
}
```

When the feature needs to type contracts with the backend, entities and response types are added. These types are the contract that both the real service and the mock must fulfill — TypeScript enforces this at compile time:

```ts
// types/account.entity.ts
export interface Account {
  id: string
  name: string
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
  code: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
```

### 2. Hooks — business logic

Everything the feature *does*: state, validations, service calls, transformations. The hook is the orchestrator.

The component doesn't know how the business works. The hook doesn't know what the screen looks like.

As the feature grows, the hook delegates to optional layers below it: services, repositories, mappers, validators. Components never touch those layers directly.

```ts
// hooks/useCreateAccount.ts

import { useState } from 'react'
import { registerService } from './registerComposedService'
import type { CreateAccountFormData, CreateAccountErrors, ApiResponse, Account } from '@/types/createAccount.types'

const initialFormData: CreateAccountFormData = { name: '', email: '', password: '' }

export function useCreateAccount() {
  const [formData, setFormData] = useState<CreateAccountFormData>(initialFormData)
  const [errors, setErrors] = useState<CreateAccountErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError   = status === 'error'

  const updateField = (field: keyof CreateAccountFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const register = async () => {
    setStatus('loading')
    const result: ApiResponse<Account> = await registerService(formData)
    if (result.status === 200 || result.status === 201) {
      setStatus('success')
    } else {
      setErrors({ general: result.error })
      setStatus('error')
    }
  }

  return { formData, errors, status, isLoading, isSuccess, isError, updateField, register }
}
```

### 3. Components — user interface

Renders and captures user interactions. No business logic, no direct service calls. The component does not change between THC and THC-C.

```tsx
// components/CreateAccountForm.tsx

import { useCreateAccount } from '../hooks/useCreateAccount'

export function CreateAccountForm() {
  const { formData, errors, isLoading, isSuccess, updateField, register } = useCreateAccount()

  if (isSuccess) return <p>Account created successfully</p>

  return (
    <form onSubmit={e => { e.preventDefault(); register() }}>
      <input
        value={formData.name}
        onChange={e => updateField('name', e.target.value)}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name}</span>}

      <input
        type="email"
        value={formData.email}
        onChange={e => updateField('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email}</span>}

      {errors.general && <span>{errors.general}</span>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
```

---

## THC-C — The Composer

The Composer is the fourth layer. It is the interchange point between the real implementation and the mock. The hook doesn't know what's on the other side — it imports a function or a service and uses it. What's behind that is decided by the Composer.

### The problem it solves

When a product depends on several services with complex flows, it's hard to reproduce all scenarios during development. You can't always ask the database to be in a specific state. The UI builder shouldn't be blocked waiting for the backend to be ready.

The Composer decouples those dependencies. The UI builder navigates complete flows — success, errors, edge cases — with structured and realistic data, without touching the real API.

### Fixtures by scenario

Each scenario is a folder. Inside, one file per service. Fixtures are typed with the entity — if the type changes, TypeScript detects which fixtures are outdated at compile time.

```
fixtures/
  success/
    createAccount.fixture.ts
  duplicateEmail/
    createAccount.fixture.ts
  serverError/
    createAccount.fixture.ts
```

```ts
// fixtures/success/createAccount.fixture.ts
import type { ApiResponse, Account } from '@/types/createAccount.types'

const fixture: ApiResponse<Account> = {
  status: 201,
  data: {
    id: 'usr_abc123',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    createdAt: '2025-01-15T10:30:00Z',
  },
}

export default fixture
```

```ts
// fixtures/duplicateEmail/createAccount.fixture.ts
import type { ApiResponse, Account } from '@/types/createAccount.types'

const fixture: ApiResponse<Account> = {
  status: 409,
  error: 'This email is already registered',
  code: 'EMAIL_DUPLICATE',
}

export default fixture
```

Changing scenarios means changing a constant in the Composer. Zero changes to the hook, zero changes to the component.

---

## THC-C variant A — without a service layer

For simple features. The Composer lives inside `hooks/` and swaps a single function. The hook imports that function without knowing whether it goes to the API or to a fixture.

```
hooks/
  registerComposedService.ts   ← Composer: function switch
  useCreateAccount.ts          ← imports registerService, unaware of what's behind
fixtures/
  success/createAccount.fixture.ts
  duplicateEmail/createAccount.fixture.ts
```

**`hooks/registerComposedService.ts`**

```ts
import type { CreateAccountFormData, ApiResponse, Account } from '@/types/createAccount.types'

const USE_MOCK = true
const SCENARIO = 'success'

const registerReal = async (data: CreateAccountFormData): Promise<ApiResponse<Account>> => {
  const response = await fetch('/api/create-account', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

const registerMock = async (_data: CreateAccountFormData): Promise<ApiResponse<Account>> => {
  const { default: fixture } = await import(`@/fixtures/${SCENARIO}/createAccount.fixture`)
  return fixture
}

export const registerService = USE_MOCK ? registerMock : registerReal
```

**`hooks/useCreateAccount.ts`** — identical to the base example, imports `registerService` from `./registerComposedService`.

### Alternative with TanStack Query

`isPending`, `isSuccess` and error handling come from the library. The hook is reduced to form state.

```ts
// hooks/useCreateAccount.ts

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { registerService } from './registerComposedService'
import type { CreateAccountFormData, CreateAccountErrors, ApiResponse, Account } from '@/types/createAccount.types'

const initialFormData: CreateAccountFormData = { name: '', email: '', password: '' }

export function useCreateAccount() {
  const [formData, setFormData] = useState<CreateAccountFormData>(initialFormData)
  const [errors, setErrors] = useState<CreateAccountErrors>({})

  const updateField = (field: keyof CreateAccountFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const { mutate: register, isPending: isLoading, isSuccess } = useMutation<
    ApiResponse<Account>,
    Error,
    CreateAccountFormData
  >({
    mutationFn: registerService,
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
    register: () => register(formData),
  }
}
```

---

## THC-C variant B — with a service layer

For features with multiple endpoints. The Composer lives in `services/` and swaps the entire service object. All methods are swapped at once.

```
services/
  createAccountService.ts         ← real implementation
  createAccountService.mock.ts    ← returns typed fixtures
  composer.ts                     ← service switch
hooks/
  useCreateAccount.ts             ← imports from services/composer
fixtures/
  success/createAccount.fixture.ts
  duplicateEmail/createAccount.fixture.ts
```

**`composeConfig.ts`** — at the global level, outside features

Controls which features use mock and what their active scenario is. One place to change the state of the entire project.

```ts
export const composeConfig = {
  createAccount: {
    useMock: true,
    scenario: 'success',
  },
  login: {
    useMock: false,
    scenario: 'success',
  },
} as const

export type FeatureKey = keyof typeof composeConfig
```

**`services/createAccountService.ts`**

```ts
import type { CreateAccountFormData, ApiResponse, Account } from '@/types/createAccount.types'

export const createAccountService = {
  register: async (data: CreateAccountFormData): Promise<ApiResponse<Account>> => {
    const response = await fetch('/api/create-account', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },
}
```

**`services/createAccountService.mock.ts`**

No logic. Just loads the fixture for the configured scenario and returns it with the correct type.

```ts
import { composeConfig } from '@/composeConfig'
import type { CreateAccountFormData, ApiResponse, Account } from '@/types/createAccount.types'

const { scenario } = composeConfig.createAccount

export const createAccountService = {
  register: async (_data: CreateAccountFormData): Promise<ApiResponse<Account>> => {
    const { default: fixture } = await import(`@/fixtures/${scenario}/createAccount.fixture`)
    return fixture
  },
}
```

**`services/composer.ts`**

```ts
import { composeConfig } from '@/composeConfig'
import { createAccountService as real } from './createAccountService'
import { createAccountService as mock } from './createAccountService.mock'

export const createAccountService = composeConfig.createAccount.useMock ? mock : real
```

**`hooks/useCreateAccount.ts`**

```ts
import { useState } from 'react'
import { createAccountService } from '../services/composer'
import type { CreateAccountFormData, CreateAccountErrors, ApiResponse, Account } from '@/types/createAccount.types'

const initialFormData: CreateAccountFormData = { name: '', email: '', password: '' }

export function useCreateAccount() {
  const [formData, setFormData] = useState<CreateAccountFormData>(initialFormData)
  const [errors, setErrors] = useState<CreateAccountErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError   = status === 'error'

  const updateField = (field: keyof CreateAccountFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const register = async () => {
    setStatus('loading')
    const result: ApiResponse<Account> = await createAccountService.register(formData)
    if (result.status === 200 || result.status === 201) {
      setStatus('success')
    } else {
      setErrors({ general: result.error })
      setStatus('error')
    }
  }

  return { formData, errors, status, isLoading, isSuccess, isError, updateField, register }
}
```

### Alternative with TanStack Query

```ts
// hooks/useCreateAccount.ts

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createAccountService } from '../services/composer'
import type { CreateAccountFormData, CreateAccountErrors, ApiResponse, Account } from '@/types/createAccount.types'

const initialFormData: CreateAccountFormData = { name: '', email: '', password: '' }

export function useCreateAccount() {
  const [formData, setFormData] = useState<CreateAccountFormData>(initialFormData)
  const [errors, setErrors] = useState<CreateAccountErrors>({})

  const updateField = (field: keyof CreateAccountFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const { mutate: register, isPending: isLoading, isSuccess } = useMutation<
    ApiResponse<Account>,
    Error,
    CreateAccountFormData
  >({
    mutationFn: createAccountService.register,
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
    register: () => register(formData),
  }
}
```

---

## Optional layers

Added when the feature needs them. Never from the start.

**Below Hooks:** `services/` for API calls, `repositories/` to abstract data access, `mappers/` to transform between backend and frontend formats, `validators/` for validation logic extracted from the hook, `utils/` for reusable helper functions.

**Below Components:** `store/` when the feature needs shared state between distant components or across features.

The hook remains the orchestrator in all cases. Components never access these layers directly.

### Store — option A with Zustand

```ts
// store/accountStore.ts
import { create } from 'zustand'
import type { Account } from '@/types/createAccount.types'

interface AccountStore {
  account: Account | null
  setAccount: (account: Account) => void
  clearAccount: () => void
}

export const useAccountStore = create<AccountStore>(set => ({
  account: null,
  setAccount: (account) => set({ account }),
  clearAccount: () => set({ account: null }),
}))
```

```ts
// hooks/useCreateAccount.ts — with Zustand + TanStack Query
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createAccountService } from '../services/composer'
import { useAccountStore } from '../store/accountStore'
import type { CreateAccountFormData, CreateAccountErrors, ApiResponse, Account } from '@/types/createAccount.types'

const initialFormData: CreateAccountFormData = { name: '', email: '', password: '' }

export function useCreateAccount() {
  const [formData, setFormData] = useState<CreateAccountFormData>(initialFormData)
  const [errors, setErrors] = useState<CreateAccountErrors>({})
  const setAccount = useAccountStore(state => state.setAccount)

  const updateField = (field: keyof CreateAccountFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const { mutate: register, isPending: isLoading, isSuccess } = useMutation<
    ApiResponse<Account>,
    Error,
    CreateAccountFormData
  >({
    mutationFn: createAccountService.register,
    onSuccess: (result) => {
      if (result.status === 200 || result.status === 201) {
        setAccount((result as ApiSuccessResponse<Account>).data)
      } else {
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
    register: () => register(formData),
  }
}
```

### Store — option B with TanStack Store

A natural fit if the project already uses TanStack Query. Everything comes from the same ecosystem.

```ts
// store/accountStore.ts
import { Store } from '@tanstack/store'
import type { Account } from '@/types/createAccount.types'

interface AccountState {
  account: Account | null
}

export const accountStore = new Store<AccountState>({ account: null })

export const setAccount = (account: Account) =>
  accountStore.setState(() => ({ account }))

export const clearAccount = () =>
  accountStore.setState(() => ({ account: null }))
```

```ts
// hooks/useCreateAccount.ts — with TanStack Store + TanStack Query
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { createAccountService } from '../services/composer'
import { accountStore, setAccount } from '../store/accountStore'
import type { CreateAccountFormData, CreateAccountErrors, ApiResponse, Account } from '@/types/createAccount.types'

const initialFormData: CreateAccountFormData = { name: '', email: '', password: '' }

export function useCreateAccount() {
  const [formData, setFormData] = useState<CreateAccountFormData>(initialFormData)
  const [errors, setErrors] = useState<CreateAccountErrors>({})
  const account = useStore(accountStore, state => state.account)

  const updateField = (field: keyof CreateAccountFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const { mutate: register, isPending: isLoading, isSuccess } = useMutation<
    ApiResponse<Account>,
    Error,
    CreateAccountFormData
  >({
    mutationFn: createAccountService.register,
    onSuccess: (result) => {
      if (result.status === 200 || result.status === 201) {
        setAccount((result as ApiSuccessResponse<Account>).data)
      } else {
        setErrors({ general: (result as ApiErrorResponse).error })
      }
    },
    onError: (error) => setErrors({ general: error.message }),
  })

  return {
    formData,
    account,
    errors,
    isLoading,
    isSuccess,
    updateField,
    register: () => register(formData),
  }
}
```

Zustand is more mature and has a larger ecosystem. TanStack Store is the natural choice if the project already uses TanStack Query — it reduces external dependencies and shares the same reactive philosophy.

---

## Gradual scaling

```
Level 1 — THC (3 files)
  types/createAccount.types.ts
  hooks/useCreateAccount.ts
  components/CreateAccountForm.tsx

Level 2 — THC-C variant A, one scenario (5 files)
  types/createAccount.types.ts
  hooks/registerComposedService.ts
  hooks/useCreateAccount.ts
  fixtures/success/createAccount.fixture.ts
  components/CreateAccountForm.tsx

Level 3 — THC-C variant A, multiple scenarios (same files, more fixture folders)
  types/createAccount.types.ts
  hooks/registerComposedService.ts
  hooks/useCreateAccount.ts
  fixtures/success/createAccount.fixture.ts
  fixtures/duplicateEmail/createAccount.fixture.ts
  fixtures/serverError/createAccount.fixture.ts
  components/CreateAccountForm.tsx

Level 4 — THC-C variant B with services and composeConfig
  composeConfig.ts                            ← global
  types/createAccount.types.ts
  services/createAccountService.ts
  services/createAccountService.mock.ts
  services/composer.ts
  hooks/useCreateAccount.ts
  fixtures/[scenario]/createAccount.fixture.ts
  components/CreateAccountForm.tsx

Level 5 — Full THC-C with store and optional layers
  composeConfig.ts
  types/createAccount.types.ts
  types/account.entity.ts
  validators/createAccountValidator.ts
  mappers/createAccountMapper.ts
  services/createAccountService.ts
  services/createAccountService.mock.ts
  services/composer.ts
  store/accountStore.ts
  hooks/useCreateAccount.ts
  fixtures/[scenario]/createAccount.fixture.ts
  components/CreateAccountForm.tsx
```

Adding new scenarios never increases the pattern's complexity. Just add a folder with the corresponding fixtures.

---

## Recommended folder structure

```
[feature]/
├── types/
│   ├── [feature].types.ts
│   └── [entity].entity.ts
├── hooks/
│   ├── use[Feature].ts
│   └── [method]ComposedService.ts    (THC-C variant A)
├── services/                          (THC-C variant B)
│   ├── [feature]Service.ts
│   ├── [feature]Service.mock.ts
│   └── composer.ts
├── store/                             (optional)
│   └── [entity]Store.ts
├── validators/                        (optional)
├── mappers/                           (optional)
├── fixtures/                          (THC-C)
│   ├── success/
│   │   └── [feature].fixture.ts
│   └── [scenario]/
│       └── [feature].fixture.ts
├── components/
│   └── [Feature]Form.tsx
└── [feature].tsx

composeConfig.ts                       (THC-C variant B, global level)
```

---

## THC / THC-C in context with other architectures

THC is a micro pattern. Hexagonal, Clean Architecture and Feature Slicing are macro patterns. They operate at different levels and can be used together without conflict.

| Characteristic | Clean Architecture | Hexagonal | MVVM | THC | THC-C |
|---|---|---|---|---|---|
| Scope | Application | Application | Module | Feature | Feature |
| Initial complexity | Very high | High | Medium | Low | Low |
| Minimum files | ~8 | ~10 | ~4 | 3 | 6 |
| Development without backend | Manual | Manual | Manual | No | Yes |
| Flexibility | Rigid | Rigid | Medium | High | High |

---

## Design patterns implemented (Refactoring Guru)

THC-C is not just a file organization convention. It applies well-known design patterns from the GoF catalog in a functional React context.

**Strategy** — the core of the Composer. Two interchangeable implementations (`registerReal` / `registerMock`) share the same signature: they receive `CreateAccountFormData` and return `Promise<ApiResponse<Account>>`. The hook is the context that calls the strategy without knowing which one it is. The Composer selects the strategy based on configuration — exactly as the pattern defines.

**Facade** — the hook acts as a facade for the component. `register()` is all the component sees. Behind it lives the Composer, the service, the fixtures, the status lifecycle. All that complexity is hidden behind a simple surface.

**Template Method** — inherited directly from the JONA pattern. The hook defines the algorithm skeleton: set loading → call service → handle result. The "abstract step" is the service call — filled in by the Composer. The flow structure lives in the hook and never changes. What varies is delegated.

**Null Object** — the mock service is a Null Object of the real service. Same interface, no side effects, always returns a valid and predictable response. The hook calls both identically. No `if (useMock)` scattered through the code.

**Factory Method** — `composeConfig.ts` combined with `composer.ts` acts as a declarative factory. Based on the feature's configuration, it decides which concrete object to deliver. The hook receives the result without knowing what was instantiated.

**Dependency Injection** — the hook doesn't create its dependency. It imports whatever the Composer has already decided. No `new CreateAccountService()` inside the hook. Injection without a container, applied through JavaScript's module system.

How they chain together:

```
Factory Method (composeConfig + composer)
    ↓ produces
Strategy (registerReal | registerMock)
    ↓ one of which is
Null Object (the mock)
    ↓ both consumed by
Template Method (hook defines the flow)
    ↓ the hook itself is
Facade (what the component sees)
```

---

## When to use each variant

Use **THC** when the feature is simple, when the team has backend access during development, or when starting the first iterations of something new.

Use **THC-C variant A** when the UI builder needs to work without the backend and the feature consumes one or a few endpoints without complex service logic.

Use **THC-C variant B** when the feature consumes multiple endpoints, has service logic that justifies its own layer, or the project needs centralized control over which features are in mock mode through `composeConfig`.

The pattern works well with React, Vue, Alpine, and any modern library based on functional components and hooks. It does not apply to Angular, where native dependency injection already imposes a different structure.

---

## Summary

Three layers always: Types defines the data, Hooks implements the logic, Components renders the UI.

THC-C adds the Composer: an interchange point that decides which implementation to deliver without the hook knowing. Fixtures are typed with the entity — if the contract changes, TypeScript detects which fixtures are broken. Scenarios live in folders: adding a new one means creating a folder, touching nothing else.

Adding complexity to the pattern is always additive. Nothing existing ever breaks.

---

## THC-C in an agile team: workflow with BDD

THC-C fits naturally with BDD when applied from the planning phase. The process connects QA's acceptance criteria with the Composer's fixtures: each Test Plan case has its own fixture folder, and the UI builder can test that exact scenario by changing a constant.

This process is described in its manual version, executed by team members.

### Roles

**Back** — exposes the API contracts and publishes them in Swagger.

**Back Support** — helps the frontend team with contract questions and has access to the development environment.

**Front IMP** — implements the real hooks and services, and co-builds the fixtures with QA.

**Front GUI** — builds the UI against mocks. Does not depend on the backend to work.

**QA** — writes User Stories with BDD criteria, structures the Test Plan, and co-builds the fixtures with Front IMP.

### General workflow

```
Planning
  Back         → publishes Swagger with all endpoints and response codes
  QA           → writes User Stories and Test Plan in BDD format
  Front IMP    → generates .types.ts files and entities from the Swagger

Start of development
  QA + Front IMP → build fixtures by scenario (one folder per leaf case)
                   configure the Composer pointing to the mock

In parallel (unblocked)
  Front GUI    → builds UI against mocks, changes scenario by changing SCENARIO constant
  Front IMP    → implements real services and hooks against the Swagger

Integration
  Front IMP    → updates the Composer to point to the real implementation
  QA           → runs all Test Plan cases against the real implementation
```

The critical sync point is having the fixtures ready. Once they exist, the team works in parallel without blocking each other.

### The Test Plan and its relationship with fixtures

The Test Plan is structured at three levels: the view or feature, the services it consumes, and the cases per service. Each leaf case (the most specific level) becomes a fixture folder.

```
Case 1 — View: Create account
  Related services:
    - POST /api/create-account
    - POST /api/send-verification-email

  Case 1.1 — POST /api/create-account

    Case 1.1.1 — Successful registration
      Given: the user fills in all valid fields
      When:  they submit the form
      Then:  they receive confirmation and are redirected to the verification step
      Response: 200

    Case 1.1.2 — Email already registered
      Given: the user enters an email that already exists
      When:  they submit the form
      Then:  they see an error message indicating the duplicate email
      Response: 409 EMAIL_DUPLICATE

    Case 1.1.3 — Server error
      Given: the service is unavailable
      When:  the user submits the form
      Then:  they see a generic error message
      Response: 500 SERVER_ERROR

  Case 1.2 — POST /api/send-verification-email

    Case 1.2.1 — Email sent successfully
      Given: registration was successful
      When:  the system tries to send the verification email
      Then:  the user sees the confirmation screen
      Response: 200

    Case 1.2.2 — Email sending failed
      Given: the email service is unavailable
      When:  the system tries to send the verification email
      Then:  the user can retry from the confirmation screen
      Response: 503 EMAIL_SERVICE_UNAVAILABLE
```

Leaf cases (1.1.1, 1.1.2, 1.1.3, 1.2.1, 1.2.2) translate directly into fixture folders:

```
fixtures/
  success/
    createAccount.fixture.ts
    verificationEmail.fixture.ts
  duplicateEmail/
    createAccount.fixture.ts
    verificationEmail.fixture.ts
  serverError/
    createAccount.fixture.ts
    verificationEmail.fixture.ts
  emailServiceUnavailable/
    createAccount.fixture.ts
    verificationEmail.fixture.ts
```

Fixtures are ready when there is one folder per leaf case. That is the condition for Front GUI to start building the UI.

### Process rules

**Types come from the Swagger, not from imagination.** If there's a discrepancy, the Swagger wins. The conversation happens with the backend team.

**Each leaf case in the Test Plan has its own fixture folder.** A case without a fixture is a scenario the UI was never tested under.

**Fixtures are typed with the entity.** If the contract changes, TypeScript flags the broken fixtures before they reach production.

**Fixtures are realistic.** Vague data produces UIs that look fine in development and break in production.

**The Mock Library is a team artifact, not Front IMP's alone.** QA co-builds the fixtures because they are the direct translation of the acceptance criteria. If QA didn't participate, the criteria and the mocks can end up out of sync.

**The Composer always has a declared state.** At any point it must be clear whether the feature is in mock mode or real mode.

### Checklist

**Planning**
- [ ] Swagger published with all endpoints and response codes
- [ ] User Stories written with BDD criteria
- [ ] Test Plan organized by view → service → case
- [ ] `.types.ts` files and entities generated from the Swagger

**Start of development**
- [ ] One fixture folder per leaf case in the Test Plan
- [ ] Fixtures typed with the corresponding entities
- [ ] Composer configured pointing to the mock
- [ ] Front GUI can change scenarios by changing the SCENARIO constant

**Integration**
- [ ] Real service implemented
- [ ] Composer updated to point to the real implementation
- [ ] Real behavior verified against the fixtures
- [ ] QA ran all Test Plan cases against the real implementation

---

## Origin

THC and THC-C are an evolution of the **JONA Pattern** (Joint Orchestrated N-layer Architecture) created by Jonathan Franchesco Torres Baca.

JONA is a conceptual pattern agnostic to platform and paradigm. Its three layers — Interface, Template, and Implementation — apply in TypeScript, Kotlin, Swift, Dart, C#, or any language that supports contracts and abstraction. On object-oriented platforms it uses class inheritance; in functional environments it uses hook or composable composition. JONA doesn't dictate how to implement the layers, only that they must be separated.

THC takes that philosophy and specializes it for the ecosystem of modern reactive libraries — React, Vue, Alpine — where the dominant paradigm is hooks and functional components. Instead of Interface/Template/Implementation, the layers are called Types/Hooks/Components: the same names every developer in that stack already uses.

THC-C extends THC with the Composer, a layer that emerges from taking JONA's philosophy to its natural consequence in modern development. JONA already established that the Template should be interchangeable with the real implementation — that the UI builder could work on a stable base without depending on the backend. The Composer formalizes that principle as its own layer: an active decision point that determines at runtime which implementation is delivered, allowing UI and business logic to be developed truly in parallel. In its most advanced form it reads configuration, combines fixtures from different services, and has the capacity to incorporate intelligence that generates and adapts those scenarios dynamically.

JONA original repository: https://github.com/Jofrantoba-Coding/patron-frontend-jona
