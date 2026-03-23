> También disponible en español: [README.es.md](./README.es.md)

# fixtures/exitoso/

Covers cases 1.1.1 and 1.2.1 of the Test Plan: successful registration and verification email sent.

```
exitoso/
├── crearCuenta.fixture.ts        ← 201, created account data
└── verificacionEmail.fixture.ts  ← 200, { enviado: true }
```

The happy path scenario. The user fills the form, registration succeeds, and the verification email arrives without issues.

When `SCENARIO = 'exitoso'` in the Composer, both endpoints return success in sequence.
