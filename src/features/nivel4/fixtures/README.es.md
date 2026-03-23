# fixtures/

Tres escenarios. Misma estructura que Nivel 3 — lo que cambió es quién los consume.

```
fixtures/
├── exitoso/
│   └── crearCuenta.fixture.ts       ← 201, cuenta creada
├── emailDuplicado/
│   └── crearCuenta.fixture.ts       ← 409 EMAIL_DUPLICADO
└── errorServidor/
    └── crearCuenta.fixture.ts       ← 500 SERVER_ERROR
```

En este nivel los fixtures los consume `crearCuentaService.mock.ts` en lugar del Composer de hooks. El escenario activo se lee desde `composeConfig.crearCuenta.scenario`.

Todos los fixtures están tipados con `ApiResponse<Cuenta>` — si el contrato cambia, TypeScript lo detecta en compilación.
