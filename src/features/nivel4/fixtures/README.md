> También disponible en español: [README.es.md](./README.es.md)

# fixtures/

Three scenarios. Same structure as Level 3 — what changed is who consumes them.

```
fixtures/
├── exitoso/
│   └── crearCuenta.fixture.ts       ← 201, account created
├── emailDuplicado/
│   └── crearCuenta.fixture.ts       ← 409 EMAIL_DUPLICADO
└── errorServidor/
    └── crearCuenta.fixture.ts       ← 500 SERVER_ERROR
```

At this level the fixtures are consumed by `crearCuentaService.mock.ts` instead of the hooks Composer. The active scenario is read from `composeConfig.crearCuenta.scenario`.

All fixtures are typed with `ApiResponse<Cuenta>` — if the contract changes, TypeScript catches it at compile time.
