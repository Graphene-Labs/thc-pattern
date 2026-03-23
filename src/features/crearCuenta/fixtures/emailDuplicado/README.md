> También disponible en español: [README.es.md](./README.es.md)

# fixtures/emailDuplicado/

Covers case 1.1.2 of the Test Plan: the entered email is already registered.

```
emailDuplicado/
├── crearCuenta.fixture.ts        ← 409 EMAIL_DUPLICADO
└── verificacionEmail.fixture.ts  ← endpoint not reached
```

`crearCuenta.fixture.ts` returns `status: 409`. The hook detects the error, sets it in `errors.general`, and does not call `enviarVerificacionEmail` — that's why the verification fixture exists but isn't used in this scenario.

The component shows the error message in the form without changing screens.
