# services/

Tres archivos, responsabilidades separadas.

```
services/
├── crearCuentaService.ts       ← llama a la API real
├── crearCuentaService.mock.ts  ← devuelve fixtures según el escenario configurado
└── composer.ts                 ← decide cuál de los dos entregar
```

---

## crearCuentaService.ts — implementación real

Llama a `fetch`. Sin lógica de negocio, sin estado. Solo la llamada HTTP y el retorno tipado.

Ver: [`crearCuentaService.ts`](./crearCuentaService.ts)

---

## crearCuentaService.mock.ts — Null Object

Misma interfaz que el servicio real. No hace llamadas HTTP — lee el escenario de `composeConfig` y devuelve el fixture correspondiente.

```ts
const scenario = composeConfig.crearCuenta.scenario // 'exitoso' | 'emailDuplicado' | 'errorServidor'
```

Ver: [`crearCuentaService.mock.ts`](./crearCuentaService.mock.ts)

---

## composer.ts — el Composer

Una línea. Lee `composeConfig.crearCuenta.useMock` y exporta el servicio que corresponde.

```ts
export const crearCuentaService = composeConfig.crearCuenta.useMock ? mock : real
```

El hook importa `crearCuentaService` de aquí. No sabe qué hay detrás.

Ver: [`composer.ts`](./composer.ts)

---

## Para cambiar de mock a real

Editar [`src/config/composeConfig.ts`](../../../config/composeConfig.ts):

```ts
crearCuenta: {
  useMock: false,  // ← cambiar esto
  scenario: 'exitoso',
}
```

Nada más cambia en el feature.
