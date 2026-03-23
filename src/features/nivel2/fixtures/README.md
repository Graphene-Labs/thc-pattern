> También disponible en español: [README.es.md](./README.es.md)

# fixtures/

Response data by scenario. Each folder is a Test Plan case.

At this level there is a single scenario: `exitoso/`. The Composer loads it when `SCENARIO = 'exitoso'`.

```
fixtures/
└── exitoso/
    └── crearCuenta.fixture.ts   ← status 201 + created account data
```

Each fixture is typed with the entity:

```ts
const fixture: ApiResponse<Cuenta> = { ... }
```

If `Cuenta` or `ApiResponse` change in `types/`, TypeScript marks this file as broken before it reaches production.

---

When the Test Plan has more cases → add a folder per scenario. See [Level 3](../../nivel3/fixtures/README.md).
