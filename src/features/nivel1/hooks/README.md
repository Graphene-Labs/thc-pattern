> También disponible en español: [README.es.md](./README.es.md)

# hooks/

The feature orchestrator. Manages state, calls services, exposes a clean interface to the component.

The component doesn't know how the business works. The hook doesn't know what the screen looks like.

```ts
// useCrearCuenta.ts — what it exposes to the component
{ formData, errors, isLoading, isSuccess, updateField, registrar }
```

At this level (basic THC), the hook calls `fetch` directly. There is no Composer or mock — if the backend is unavailable, the feature doesn't work.

See: [`useCrearCuenta.ts`](./useCrearCuenta.ts)

---

When the feature needs to work without a backend, the hook doesn't change. A `registrarComposedService.ts` is added alongside it and the hook imports from there instead of calling `fetch` directly. See [Level 2](../../nivel2/hooks/README.md).
