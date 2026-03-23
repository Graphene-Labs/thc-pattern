# services/

Tres archivos. Misma estructura que Nivel 4, pero el mock ahora cubre dos endpoints.

```
services/
├── crearCuentaService.ts       ← implementación real: registrar + enviarVerificacionEmail
├── crearCuentaService.mock.ts  ← devuelve fixtures para ambos endpoints
└── composer.ts                 ← una línea: decide cuál de los dos exportar
```

---

## crearCuentaService.ts — real

Dos métodos: `registrar` y `enviarVerificacionEmail`. Cada uno hace su llamada HTTP y retorna el tipo correspondiente.

Ver: [`crearCuentaService.ts`](./crearCuentaService.ts)

---

## crearCuentaService.mock.ts — Null Object

Misma interfaz que el real. Lee el escenario de `composeConfig` y devuelve el fixture correcto para cada método.

Tiene dos mapas de fixtures — uno por endpoint:

```ts
const fixturesCuenta = { exitoso, emailDuplicado, errorServidor, emailServiceUnavailable }
const fixturesEmail  = { exitoso, emailDuplicado, errorServidor, emailServiceUnavailable }
```

Esto permite que un escenario como `emailServiceUnavailable` devuelva éxito en `registrar` y error en `enviarVerificacionEmail` — exactamente como ocurriría en producción.

Ver: [`crearCuentaService.mock.ts`](./crearCuentaService.mock.ts)

---

## composer.ts — el Composer

```ts
export const crearCuentaService = composeConfig.crearCuenta.useMock ? mock : real
```

El hook importa `crearCuentaService` de aquí. Para cambiar de mock a real, solo se edita [`src/config/composeConfig.ts`](../../../config/composeConfig.ts).

Ver: [`composer.ts`](./composer.ts)
