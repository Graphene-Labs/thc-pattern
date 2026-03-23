> También disponible en español: [README.es.md](./README.es.md)

# services/

Three files, separated responsibilities.

```
services/
├── crearCuentaService.ts       ← calls the real API
├── crearCuentaService.mock.ts  ← returns fixtures based on configured scenario
└── composer.ts                 ← decides which one to deliver
```

---

## crearCuentaService.ts — real implementation

Calls `fetch`. No business logic, no state. Just the HTTP call and the typed return.

See: [`crearCuentaService.ts`](./crearCuentaService.ts)

---

## crearCuentaService.mock.ts — Null Object

Same interface as the real service. Makes no HTTP calls — reads the scenario from `composeConfig` and returns the corresponding fixture.

```ts
const scenario = composeConfig.crearCuenta.scenario // 'exitoso' | 'emailDuplicado' | 'errorServidor'
```

See: [`crearCuentaService.mock.ts`](./crearCuentaService.mock.ts)

---

## composer.ts — the Composer

One line. Reads `composeConfig.crearCuenta.useMock` and exports the matching service.

```ts
export const crearCuentaService = composeConfig.crearCuenta.useMock ? mock : real
```

The hook imports `crearCuentaService` from here. It doesn't know what's behind it.

See: [`composer.ts`](./composer.ts)

---

## To switch from mock to real

Edit [`src/config/composeConfig.ts`](../../../config/composeConfig.ts):

```ts
crearCuenta: {
  useMock: false,  // ← change this
  scenario: 'exitoso',
}
```

Nothing else changes in the feature.
