> También disponible en español: [README.es.md](./README.es.md)

# fixtures/

Three scenarios, three folders. Each one corresponds to a leaf case in the Test Plan.

```
fixtures/
├── exitoso/
│   └── crearCuenta.fixture.ts       ← 201, account created
├── emailDuplicado/
│   └── crearCuenta.fixture.ts       ← 409 EMAIL_DUPLICADO
└── errorServidor/
    └── crearCuenta.fixture.ts       ← 500 SERVER_ERROR
```

The Composer in [`hooks/registrarComposedService.ts`](../hooks/registrarComposedService.ts) imports all three and exposes the active one based on `SCENARIO`.

All fixtures are typed with `ApiResponse<Cuenta>`. If the type changes, TypeScript flags outdated fixtures at compile time — not at runtime.

---

## Adding a new scenario

1. Create a folder with the case name (`networkTimeout/`, `blockedUser/`, etc.)
2. Create `crearCuenta.fixture.ts` typed with `ApiResponse<Cuenta>`
3. Import it in the Composer and add it to the `fixtures` object
4. Change `SCENARIO` to the new name

Nothing else changes.
