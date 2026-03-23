# fixtures/exitoso/

Cubre los casos 1.1.1 y 1.2.1 del Test Plan: registro exitoso y email de verificación enviado.

```
exitoso/
├── crearCuenta.fixture.ts        ← 201, datos de la cuenta creada
└── verificacionEmail.fixture.ts  ← 200, { enviado: true }
```

Es el escenario del flujo feliz completo. El usuario llena el formulario, el registro es exitoso y el email de verificación llega sin problemas.

Cuando `SCENARIO = 'exitoso'` en el Composer, ambos endpoints devuelven éxito en secuencia.
