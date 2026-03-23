# hooks/

Dos archivos. El hook de negocio y el Composer.

---

## registrarComposedService.ts — el Composer

El punto de intercambio. Dos constantes lo controlan todo:

```ts
const USE_MOCK = true      // false → va a la API real
const SCENARIO = 'exitoso' // cambia el escenario activo
```

El hook importa `registrarService` de aquí. No sabe si va a la API o al fixture — eso es exactamente lo que el Composer garantiza.

Ver: [`registrarComposedService.ts`](./registrarComposedService.ts)

---

## useCrearCuenta.ts — el orquestador

Idéntico en lógica al Nivel 1. La única diferencia es que en lugar de llamar a `fetch` directamente, importa `registrarService` del Composer:

```ts
// antes (nivel 1)
const response = await fetch('/api/crear-cuenta', { ... })

// ahora (nivel 2+)
import { registrarService } from './registrarComposedService'
const result = await registrarService(formData)
```

Ver: [`useCrearCuenta.ts`](./useCrearCuenta.ts)
