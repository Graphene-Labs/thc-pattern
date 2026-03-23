> También disponible en español: [README.es.md](./README.es.md)

# Level 3 — THC-C Variant A, multiple scenarios

Same Composer as Level 2. The only difference: more fixture folders.

```
nivel3/
├── types/crearCuenta.types.ts
├── hooks/
│   ├── registrarComposedService.ts  ← Composer: now knows 3 scenarios
│   └── useCrearCuenta.ts
├── fixtures/
│   ├── exitoso/crearCuenta.fixture.ts
│   ├── emailDuplicado/crearCuenta.fixture.ts
│   └── errorServidor/crearCuenta.fixture.ts
└── components/CrearCuentaForm.tsx
```

Adding a new scenario means creating a folder. The hook and component are not touched.

---

## What changed from Level 2

**[`hooks/registrarComposedService.ts`](./hooks/README.md)** — the `fixtures` object now includes three scenarios. Changing `SCENARIO` between them is all the UI builder does to test each case:

```ts
const SCENARIO: keyof typeof fixtures = 'emailDuplicado' // ← change here
```

**[`fixtures/`](./fixtures/README.md)** — three folders, one per Test Plan case. Each fixture is typed — if the contract changes, TypeScript detects which ones are broken.

The hook and component are identical to Level 2.

---

## When to move to the next level

When the feature has multiple endpoints and service logic that justifies its own layer → [Level 4](../nivel4/README.md) introduces `services/` and `composeConfig.ts`.
