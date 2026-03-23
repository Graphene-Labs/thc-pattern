# types/

Contratos del feature. Todo lo que entra y sale está definido aquí.

```ts
// Entidad
Cuenta                      ← lo que el backend devuelve al crear la cuenta

// Formulario
CrearCuentaFormData          ← campos del form
CrearCuentaErrors            ← errores por campo + error general

// Respuestas API
ApiSuccessResponse<T>        ← status 200 | 201 + data
ApiErrorResponse             ← status 400 | 401 | 409 | 500 | 503 + error + code
ApiResponse<T>               ← union: éxito | error

// Servicios
VerificacionEmailResponse    ← respuesta del endpoint de verificación de email
```

Este nivel agrega `VerificacionEmailResponse` respecto a los niveles anteriores porque el feature consume dos endpoints: `POST /api/crear-cuenta` y `POST /api/enviar-verificacion-email`.

Los fixtures están tipados con estas interfaces. Si cambia `Cuenta` o `ApiResponse`, TypeScript señala los fixtures rotos en compilación.

Ver: [`crearCuenta.types.ts`](./crearCuenta.types.ts)
