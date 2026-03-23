# fixtures/

Datos de respuesta por escenario. Cada carpeta es un caso del Test Plan.

En este nivel hay un solo escenario: `exitoso/`. El Composer lo carga cuando `SCENARIO = 'exitoso'`.

```
fixtures/
└── exitoso/
    └── crearCuenta.fixture.ts   ← status 201 + datos de la cuenta creada
```

Cada fixture está tipado con la entidad:

```ts
const fixture: ApiResponse<Cuenta> = { ... }
```

Si `Cuenta` o `ApiResponse` cambian en `types/`, TypeScript marca este archivo como roto antes de que llegue a producción.

---

Cuando el Test Plan tenga más casos → se agrega una carpeta por escenario. Ver [Nivel 3](../../nivel3/fixtures/README.es.md).
