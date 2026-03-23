# fixtures/emailServiceUnavailable/

Cubre el caso 1.2.2 del Test Plan: el registro fue exitoso pero el servicio de email no está disponible.

```
emailServiceUnavailable/
├── crearCuenta.fixture.ts        ← 201, cuenta creada (registro exitoso)
└── verificacionEmail.fixture.ts  ← 503 EMAIL_SERVICE_UNAVAILABLE
```

Este es el escenario más interesante del feature: dos endpoints, dos resultados distintos en la misma llamada. El registro sale bien — la cuenta se crea y se guarda en el store — pero el email de verificación falla.

El hook detecta el error en el segundo endpoint, setea `status = 'emailError'` y expone `reintentarEmail()`. El componente muestra una pantalla de error con un botón de reintento en lugar del formulario.

Es el único escenario donde `reintentarEmail()` tiene sentido. Sin este fixture, esa rama del hook nunca se podría probar en desarrollo.
