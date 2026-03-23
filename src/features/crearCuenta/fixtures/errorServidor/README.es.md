# fixtures/errorServidor/

Cubre el caso 1.1.3 del Test Plan: el servicio no está disponible al intentar registrar.

```
errorServidor/
├── crearCuenta.fixture.ts        ← 500 SERVER_ERROR
└── verificacionEmail.fixture.ts  ← no se llega a este endpoint
```

`crearCuenta.fixture.ts` devuelve `status: 500`. El hook setea `errors.general` con el mensaje de error y no llama a `enviarVerificacionEmail`.

El componente muestra el error genérico en el formulario. El usuario puede corregir e intentar de nuevo.
