# config/

Configuración global del Composer. Un solo lugar para controlar qué features usan mock y qué escenario tienen activo.

```ts
// composeConfig.ts
export const composeConfig = {
  crearCuenta: {
    useMock: true,      // false → el feature va a la API real
    scenario: 'exitoso' // escenario activo cuando useMock es true
  },
} as const
```

Cada feature con THC-C Variante B tiene su entrada aquí. Para cambiar el estado de un feature — mock a real, o cambiar el escenario — solo se edita este archivo. Nada más cambia en el feature.

---

## Valores válidos para `scenario`

Deben coincidir con los nombres de las carpetas en `fixtures/` del feature correspondiente. Si se escribe un nombre que no existe, el mock no encontrará el fixture y fallará en runtime. Mantener esta lista sincronizada con las carpetas de fixtures es responsabilidad de quien agrega escenarios nuevos.

Ver: [`composeConfig.ts`](./composeConfig.ts)
