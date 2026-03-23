# crearCuenta — Nivel 5, THC-C completo

El feature completo. Todas las capas activas: types, validators, mappers, services, composer, store, hooks, fixtures y components.

```
crearCuenta/
├── types/crearCuenta.types.ts
├── validators/crearCuentaValidator.ts
├── mappers/crearCuentaMapper.ts
├── services/
│   ├── crearCuentaService.ts
│   ├── crearCuentaService.mock.ts
│   └── composer.ts
├── store/cuentaStore.ts
├── hooks/useCrearCuenta.ts
├── fixtures/
│   ├── exitoso/
│   ├── emailDuplicado/
│   ├── errorServidor/
│   └── emailServiceUnavailable/
└── components/CrearCuentaForm.tsx
```

El hook sigue siendo el único orquestador. El componente no toca ninguna capa debajo de él.

---

## Qué hace cada capa

**[`types/`](./types/)** — contratos del feature. Incluye `VerificacionEmailResponse` porque este nivel consume dos endpoints.

**[`validators/`](./validators/)** — validación local antes de llamar al servicio. El hook la invoca antes de hacer cualquier llamada HTTP.

**[`mappers/`](./mappers/)** — transforma la respuesta raw del backend (snake_case) a la entidad interna. Se usa en el servicio real, no en el mock.

**[`services/`](./services/)** — implementación real, mock y Composer. Ver el README de esa carpeta.

**[`store/`](./store/)** — estado compartido con Zustand. Guarda la `Cuenta` creada para que otros componentes o features puedan accederla sin prop drilling.

**[`hooks/useCrearCuenta.ts`](./hooks/useCrearCuenta.ts)** — orquesta el flujo completo: valida → registra → guarda en store → envía email de verificación → maneja reintentos.

**[`fixtures/`](./fixtures/)** — cuatro escenarios, uno por caso hoja del Test Plan. Ver el README de esa carpeta.

**[`components/CrearCuentaForm.tsx`](./components/CrearCuentaForm.tsx)** — renderiza el formulario. Sin lógica de negocio.

---

## Estado del Composer

Controlado desde [`src/config/composeConfig.ts`](../../config/composeConfig.ts):

```ts
crearCuenta: {
  useMock: true,      // false → API real
  scenario: 'exitoso' // escenario activo del mock
}
```
