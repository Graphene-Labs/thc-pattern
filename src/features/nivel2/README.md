> También disponible en español: [README.es.md](./README.es.md)

# Level 2 — THC-C Variant A, one scenario

The Composer is added. The hook no longer calls `fetch` directly — it imports `registrarService` from `registrarComposedService.ts` without knowing what's behind it.

```
nivel2/
├── types/crearCuenta.types.ts
├── hooks/
│   ├── registrarComposedService.ts  ← Composer: real/mock switch
│   └── useCrearCuenta.ts            ← imports registrarService, unaware of what it is
├── fixtures/
│   └── exitoso/crearCuenta.fixture.ts
└── components/CrearCuentaForm.tsx
```

The component doesn't change from Level 1. The hook logic doesn't change either — only where it imports the service from.

---

## What each layer does

**[`types/`](./types/README.md)** — same as Level 1.

**[`hooks/registrarComposedService.ts`](./hooks/README.md)** — the Composer. Two constants control the behavior:
- `USE_MOCK = true` → uses the fixture
- `SCENARIO = 'exitoso'` → selects which fixture to return

**[`hooks/useCrearCuenta.ts`](./hooks/README.md)** — same logic as Level 1, but imports `registrarService` from the Composer instead of calling `fetch` directly.

**[`fixtures/exitoso/`](./fixtures/README.md)** — a single scenario: successful registration. Typed with `ApiResponse<Cuenta>` — if the type changes, TypeScript catches it here.

---

## When to move to the next level

When multiple scenarios are needed (error, duplicate email, etc.) → [Level 3](../nivel3/README.md) adds more fixture folders without touching anything else.
