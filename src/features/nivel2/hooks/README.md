> También disponible en español: [README.es.md](./README.es.md)

# hooks/

Two files. The business hook and the Composer.

---

## registrarComposedService.ts — the Composer

The interchange point. Two constants control everything:

```ts
const USE_MOCK = true       // false → goes to the real API
const SCENARIO = 'exitoso'  // changes the active scenario
```

The hook imports `registrarService` from here. It doesn't know whether it goes to the API or to a fixture — that's exactly what the Composer guarantees.

See: [`registrarComposedService.ts`](./registrarComposedService.ts)

---

## useCrearCuenta.ts — the orchestrator

Identical in logic to Level 1. The only difference is that instead of calling `fetch` directly, it imports `registrarService` from the Composer:

```ts
// before (level 1)
const response = await fetch('/api/crear-cuenta', { ... })

// now (level 2+)
import { registrarService } from './registrarComposedService'
const result = await registrarService(formData)
```

See: [`useCrearCuenta.ts`](./useCrearCuenta.ts)
