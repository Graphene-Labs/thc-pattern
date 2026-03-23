> También disponible en español: [README.es.md](./README.es.md)

# types/

Data contracts for the feature. No logic, no calls, no rendering.

```ts
// crearCuenta.types.ts
CrearCuentaFormData    ← form field shapes
CrearCuentaErrors      ← per-field errors + general error
Cuenta                 ← entity returned by the backend
ApiSuccessResponse<T>  ← typed success response
ApiErrorResponse       ← error response with status and message
ApiResponse<T>         ← union type: success | error
```

`ApiResponse<T>` is the contract both the real service and the mock must fulfill. TypeScript enforces this at compile time — if the backend changes the contract, broken fixtures are detected before reaching production.

See: [`crearCuenta.types.ts`](./crearCuenta.types.ts)
