# Nivel 2 — THC-C Variante A, un escenario

Se agrega el Composer. El hook ya no llama a `fetch` directamente — importa `registrarService` desde `registrarComposedService.ts` sin saber qué hay detrás.

```
nivel2/
├── types/crearCuenta.types.ts
├── hooks/
│   ├── registrarComposedService.ts  ← Composer: switch real/mock
│   └── useCrearCuenta.ts            ← importa registrarService, no sabe qué es
├── fixtures/
│   └── exitoso/crearCuenta.fixture.ts
└── components/CrearCuentaForm.tsx
```

El componente no cambia respecto al Nivel 1. El hook tampoco cambia en su lógica — solo cambia de dónde importa el servicio.

---

## Qué hace cada capa

**[`types/`](./types/)** — igual que Nivel 1.

**[`hooks/registrarComposedService.ts`](./hooks/registrarComposedService.ts)** — el Composer. Dos constantes controlan el comportamiento:
- `USE_MOCK = true` → usa el fixture
- `SCENARIO = 'exitoso'` → selecciona qué fixture devolver

**[`hooks/useCrearCuenta.ts`](./hooks/useCrearCuenta.ts)** — igual que Nivel 1 en lógica, pero importa `registrarService` del Composer en lugar de llamar a `fetch` directamente.

**[`fixtures/exitoso/`](./fixtures/exitoso/)** — un solo escenario: registro exitoso. Tipado con `ApiResponse<Cuenta>` — si el tipo cambia, TypeScript lo detecta aquí.

---

## Cuándo subir al siguiente nivel

Cuando se necesiten múltiples escenarios (error, email duplicado, etc.) → [Nivel 3](../nivel3/README.es.md) agrega más carpetas de fixtures sin tocar nada más.
