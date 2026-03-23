> También disponible en español: [README.es.md](./README.es.md)

# services/

Three files. Same structure as Level 4, but the mock now covers two endpoints.

```
services/
├── crearCuentaService.ts       ← real: registrar + enviarVerificacionEmail
├── crearCuentaService.mock.ts  ← returns fixtures for both endpoints
└── composer.ts                 ← one line: decides which one to export
```

---

## crearCuentaService.ts — real

Two methods: `registrar` and `enviarVerificacionEmail`. Each makes its HTTP call and returns the corresponding type.

See: [`crearCuentaService.ts`](./crearCuentaService.ts)

---

## crearCuentaService.mock.ts — Null Object

Same interface as the real service. Reads the scenario from `composeConfig` and returns the correct fixture for each method.

Has two fixture maps — one per endpoint:

```ts
const fixturesCuenta = { exitoso, emailDuplicado, errorServidor, emailServiceUnavailable }
const fixturesEmail  = { exitoso, emailDuplicado, errorServidor, emailServiceUnavailable }
```

This allows a scenario like `emailServiceUnavailable` to return success on `registrar` and error on `enviarVerificacionEmail` — exactly as it would happen in production.

See: [`crearCuentaService.mock.ts`](./crearCuentaService.mock.ts)

---

## composer.ts — the Composer

```ts
export const crearCuentaService = composeConfig.crearCuenta.useMock ? mock : real
```

The hook imports `crearCuentaService` from here. To switch from mock to real, only [`src/config/composeConfig.ts`](../../../config/composeConfig.ts) needs to be edited.

See: [`composer.ts`](./composer.ts)
