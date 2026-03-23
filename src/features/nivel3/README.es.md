# Nivel 3 — THC-C Variante A, múltiples escenarios

Mismo Composer que el Nivel 2. La única diferencia: hay más carpetas de fixtures.

```
nivel3/
├── types/crearCuenta.types.ts
├── hooks/
│   ├── registrarComposedService.ts  ← Composer: ahora conoce 3 escenarios
│   └── useCrearCuenta.ts
├── fixtures/
│   ├── exitoso/crearCuenta.fixture.ts
│   ├── emailDuplicado/crearCuenta.fixture.ts
│   └── errorServidor/crearCuenta.fixture.ts
└── components/CrearCuentaForm.tsx
```

Agregar un escenario nuevo es crear una carpeta. No se toca el hook, no se toca el componente.

---

## Qué cambió respecto al Nivel 2

**[`hooks/registrarComposedService.ts`](./hooks/registrarComposedService.ts)** — el objeto `fixtures` ahora incluye los tres escenarios. Cambiar `SCENARIO` entre ellos es lo único que hace el maquetador para probar cada caso:

```ts
const SCENARIO: keyof typeof fixtures = 'emailDuplicado' // ← cambia aquí
```

**[`fixtures/`](./fixtures/)** — tres carpetas, una por caso del Test Plan. Cada fixture está tipado — si el contrato cambia, TypeScript detecta cuáles están rotos.

El hook y el componente son idénticos al Nivel 2.

---

## Cuándo subir al siguiente nivel

Cuando el feature tenga múltiples endpoints y la lógica de servicio justifique su propia capa → [Nivel 4](../nivel4/README.es.md) introduce `services/` y `composeConfig.ts`.
