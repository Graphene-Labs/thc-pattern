> También disponible en español: [README.es.md](./README.es.md)

# fixtures/

Four scenarios. Each folder is a Test Plan leaf case, co-built by QA and Front IMP.

```
fixtures/
├── exitoso/
│   ├── crearCuenta.fixture.ts         ← 201, account created
│   └── verificacionEmail.fixture.ts   ← 200, email sent
├── emailDuplicado/
│   ├── crearCuenta.fixture.ts         ← 409 EMAIL_DUPLICADO
│   └── verificacionEmail.fixture.ts   ← endpoint not reached
├── errorServidor/
│   ├── crearCuenta.fixture.ts         ← 500 SERVER_ERROR
│   └── verificacionEmail.fixture.ts   ← endpoint not reached
└── emailServiceUnavailable/
    ├── crearCuenta.fixture.ts         ← 201, account created (successful registration)
    └── verificacionEmail.fixture.ts   ← 503 EMAIL_SERVICE_UNAVAILABLE
```

Each scenario has one file per endpoint. The mock (`crearCuentaService.mock.ts`) loads them separately — so `emailServiceUnavailable` can return success on registration and error on email, replicating the exact real-world behavior.

All fixtures are typed:
- `crearCuenta.fixture.ts` → `ApiResponse<Cuenta>`
- `verificacionEmail.fixture.ts` → `ApiResponse<VerificacionEmailResponse>`

If the types change, TypeScript flags broken fixtures at compile time.

---

## Relationship with the BDD Test Plan

Each folder here corresponds to a Test Plan leaf case:

| Folder | Case | Scenario |
|--------|------|----------|
| `exitoso/` | 1.1.1 + 1.2.1 | Successful registration and email |
| `emailDuplicado/` | 1.1.2 | Email already registered |
| `errorServidor/` | 1.1.3 | Server error |
| `emailServiceUnavailable/` | 1.2.2 | Email send failure |

Fixtures are ready when there is one folder per leaf case. That's the condition for Front GUI to start building the UI.
