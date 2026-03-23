> También disponible en español: [README.es.md](./README.es.md)

# Level 4 — THC-C Variant B, with service layer

`services/` and a global `composeConfig.ts` are introduced. The Composer no longer swaps a single function — it swaps the entire service object. All methods are swapped at once.

```
src/config/composeConfig.ts          ← global control: useMock + scenario per feature

nivel4/
├── types/crearCuenta.types.ts
├── services/
│   ├── crearCuentaService.ts        ← real implementation
│   ├── crearCuentaService.mock.ts   ← returns typed fixtures
│   └── composer.ts                  ← switch: real vs mock
├── hooks/useCrearCuenta.ts          ← imports from services/composer
├── fixtures/
│   ├── exitoso/crearCuenta.fixture.ts
│   ├── emailDuplicado/crearCuenta.fixture.ts
│   └── errorServidor/crearCuenta.fixture.ts
└── components/CrearCuentaForm.tsx
```

---

## What each layer does

**[`src/config/composeConfig.ts`](../../../config/README.md)** — one place to control the state of all features in the project. To switch from mock to real, or change the active scenario, only this file is edited.

**[`services/`](./services/README.md)** — three files with clear responsibilities. See that folder's README.

**[`hooks/useCrearCuenta.ts`](./hooks/useCrearCuenta.ts)** — imports `crearCuentaService` from `services/composer`. Doesn't know if it's real or mock.

**[`fixtures/`](./fixtures/README.md)** — same as Level 3. Scenarios don't change, only who consumes them (now `crearCuentaService.mock.ts` instead of the hooks Composer).

---

## When to move to the next level

When the feature needs local validation, backend data transformation, shared state between components, or a second endpoint → [crearCuenta](../crearCuenta/README.md) shows the full level.
