> También disponible en español: [README.es.md](./README.es.md)

# hooks/

Same as Level 2, but the Composer now handles multiple scenarios.

---

## registrarComposedService.ts — the Composer

```ts
const fixtures = { exitoso, emailDuplicado, errorServidor }
const SCENARIO: keyof typeof fixtures = 'exitoso'
```

`SCENARIO` is typed as `keyof typeof fixtures` — TypeScript won't let you write a scenario name that doesn't exist. If a new fixture folder is added and not registered here, the type catches it.

See: [`registrarComposedService.ts`](./registrarComposedService.ts)

---

## useCrearCuenta.ts

No changes from Level 2. The hook doesn't know how many scenarios exist — that's the Composer's responsibility.

See: [`useCrearCuenta.ts`](./useCrearCuenta.ts)
