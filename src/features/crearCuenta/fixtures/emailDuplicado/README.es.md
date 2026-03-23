# fixtures/emailDuplicado/

Cubre el caso 1.1.2 del Test Plan: el email ingresado ya está registrado.

```
emailDuplicado/
├── crearCuenta.fixture.ts        ← 409 EMAIL_DUPLICADO
└── verificacionEmail.fixture.ts  ← no se llega a este endpoint
```

`crearCuenta.fixture.ts` devuelve `status: 409`. El hook detecta el error, lo setea en `errors.general` y no llama a `enviarVerificacionEmail` — por eso el fixture de verificación existe pero no se usa en este escenario.

El componente muestra el mensaje de error en el formulario sin cambiar de pantalla.
