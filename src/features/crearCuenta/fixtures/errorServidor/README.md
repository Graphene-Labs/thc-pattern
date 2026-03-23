> También disponible en español: [README.es.md](./README.es.md)

# fixtures/errorServidor/

Covers case 1.1.3 of the Test Plan: the service is unavailable when trying to register.

```
errorServidor/
├── crearCuenta.fixture.ts        ← 500 SERVER_ERROR
└── verificacionEmail.fixture.ts  ← endpoint not reached
```

`crearCuenta.fixture.ts` returns `status: 500`. The hook sets `errors.general` with the error message and does not call `enviarVerificacionEmail`.

The component shows the generic error in the form. The user can correct and try again.
