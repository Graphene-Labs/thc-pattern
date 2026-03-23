> También disponible en español: [README.es.md](./README.es.md)

# crearCuenta — Level 5, full THC-C

The complete feature. All layers active: types, validators, mappers, services, composer, store, hooks, fixtures, and components.

```
crearCuenta/
├── types/crearCuenta.types.ts
├── validators/crearCuentaValidator.ts
├── mappers/crearCuentaMapper.ts
├── services/
│   ├── crearCuentaService.ts
│   ├── crearCuentaService.mock.ts
│   └── composer.ts
├── store/cuentaStore.ts
├── hooks/useCrearCuenta.ts
├── fixtures/
│   ├── exitoso/
│   ├── emailDuplicado/
│   ├── errorServidor/
│   └── emailServiceUnavailable/
└── components/CrearCuentaForm.tsx
```

The hook is still the only orchestrator. The component doesn't touch any layer below it.

---

## What each layer does

**[`types/`](./types/README.md)** — feature contracts. Includes `VerificacionEmailResponse` because this level consumes two endpoints.

**[`validators/`](./validators/README.md)** — local validation before calling the service. The hook invokes it before making any HTTP call.

**[`mappers/`](./mappers/README.md)** — transforms the raw backend response (snake_case) to the internal entity. Used in the real service, not in the mock.

**[`services/`](./services/README.md)** — real implementation, mock, and Composer. See that folder's README.

**[`store/`](./store/README.md)** — shared state with Zustand. Stores the created `Cuenta` so other components or features can access it without prop drilling.

**[`hooks/useCrearCuenta.ts`](./hooks/README.md)** — orchestrates the full flow: validate → register → save to store → send verification email → handle retries.

**[`fixtures/`](./fixtures/README.md)** — four scenarios, one per Test Plan leaf case. See that folder's README.

**[`components/CrearCuentaForm.tsx`](./components/README.md)** — renders the form. No business logic.

---

## Composer state

Controlled from [`src/config/composeConfig.ts`](../../config/README.md):

```ts
crearCuenta: {
  useMock: true,       // false → real API
  scenario: 'exitoso'  // active mock scenario
}
```
