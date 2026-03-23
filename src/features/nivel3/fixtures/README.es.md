# fixtures/

Tres escenarios, tres carpetas. Cada una corresponde a un caso hoja del Test Plan.

```
fixtures/
├── exitoso/
│   └── crearCuenta.fixture.ts       ← 201, cuenta creada
├── emailDuplicado/
│   └── crearCuenta.fixture.ts       ← 409 EMAIL_DUPLICADO
└── errorServidor/
    └── crearCuenta.fixture.ts       ← 500 SERVER_ERROR
```

El Composer en [`hooks/registrarComposedService.ts`](../hooks/registrarComposedService.ts) importa los tres y expone el activo según `SCENARIO`.

Todos los fixtures están tipados con `ApiResponse<Cuenta>`. Si el tipo cambia, TypeScript señala los fixtures desactualizados en compilación — no en runtime.

---

## Agregar un escenario nuevo

1. Crear la carpeta con el nombre del caso (`timeoutRed/`, `usuarioBloqueado/`, etc.)
2. Crear `crearCuenta.fixture.ts` tipado con `ApiResponse<Cuenta>`
3. Importarlo en el Composer y agregarlo al objeto `fixtures`
4. Cambiar `SCENARIO` al nuevo nombre

Nada más cambia.
