> También disponible en español: [README.es.md](./README.es.md)

# types/

Feature contracts. Everything that enters and exits is defined here.

```ts
// Entity
Cuenta                       ← what the backend returns when creating an account

// Form
CrearCuentaFormData           ← form fields
CrearCuentaErrors             ← per-field errors + general error

// API responses
ApiSuccessResponse<T>         ← status 200 | 201 + data
ApiErrorResponse              ← status 400 | 401 | 409 | 500 | 503 + error + code
ApiResponse<T>                ← union: success | error

// Services
VerificacionEmailResponse     ← response from the email verification endpoint
```

This level adds `VerificacionEmailResponse` compared to previous levels because the feature consumes two endpoints: `POST /api/crear-cuenta` and `POST /api/enviar-verificacion-email`.

Fixtures are typed with these interfaces. If `Cuenta` or `ApiResponse` change, TypeScript flags broken fixtures at compile time.

See: [`crearCuenta.types.ts`](./crearCuenta.types.ts)
