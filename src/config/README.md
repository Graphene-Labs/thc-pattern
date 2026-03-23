> También disponible en español: [README.es.md](./README.es.md)

# config/

Global Composer configuration. One place to control which features use mock and what scenario they have active.

```ts
// composeConfig.ts
export const composeConfig = {
  crearCuenta: {
    useMock: true,       // false → feature calls the real API
    scenario: 'exitoso'  // active scenario when useMock is true
  },
} as const
```

Each feature using THC-C Variant B has an entry here. To change a feature's state — mock to real, or switch scenario — only this file needs to be edited. Nothing else changes in the feature.

---

## Valid values for `scenario`

Must match folder names inside the feature's `fixtures/` directory. If a name is written that doesn't exist, the mock won't find the fixture and will fail at runtime. Keeping this in sync with fixture folders is the responsibility of whoever adds new scenarios.

See: [`composeConfig.ts`](./composeConfig.ts)
