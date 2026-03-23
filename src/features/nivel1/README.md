> También disponible en español: [README.es.md](./README.es.md)

# Level 1 — Basic THC

Three files, three responsibilities. No Composer, no mocks, no extra layers.

```
nivel1/
├── types/crearCuenta.types.ts    ← data contracts
├── hooks/useCrearCuenta.ts       ← logic and state
└── components/CrearCuentaForm.tsx
```

The hook calls the API directly. There is no interchange point — when the backend is unavailable, the feature doesn't work. That's fine for early iterations or when the team has backend access during development.

---

## What each layer does

**[`types/`](./types/README.md)** — defines the shape of data: the form, errors, the `Cuenta` entity, and API response types.

**[`hooks/useCrearCuenta.ts`](./hooks/README.md)** — manages form state, calls `fetch('/api/crear-cuenta')` directly, and exposes `{ formData, errors, isLoading, isSuccess, updateField, registrar }` to the component.

**[`components/CrearCuentaForm.tsx`](./components/README.md)** — renders the form. Knows nothing about the API or internal state. Only consumes what the hook exposes.

---

## When to move to the next level

When the UI builder needs to work without depending on the backend → [Level 2](../nivel2/README.md) adds the Composer.
