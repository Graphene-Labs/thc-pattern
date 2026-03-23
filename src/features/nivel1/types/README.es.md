# types/

Contratos de datos del feature. Sin lógica, sin llamadas, sin renderizado.

```ts
// crearCuenta.types.ts
CrearCuentaFormData   ← shape del formulario
CrearCuentaErrors     ← errores por campo + error general
Cuenta                ← entidad que devuelve el backend
ApiSuccessResponse<T> ← respuesta exitosa tipada
ApiErrorResponse      ← respuesta de error con status y mensaje
ApiResponse<T>        ← union type: éxito | error
```

`ApiResponse<T>` es el contrato que tanto el servicio real como el mock deben cumplir. TypeScript lo verifica en compilación — si el backend cambia el contrato, los fixtures rotos se detectan antes de llegar a producción.

Ver: [`crearCuenta.types.ts`](./crearCuenta.types.ts)
