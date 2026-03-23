# validators/

Validación local del formulario antes de llamar al servicio.

El hook invoca `validarCrearCuenta(formData)` al inicio de `registrar()`. Si hay errores, los setea y retorna sin hacer ninguna llamada HTTP.

```ts
// crearCuentaValidator.ts
validarCrearCuenta(data: CrearCuentaFormData): CrearCuentaErrors
tieneErrores(errors: CrearCuentaErrors): boolean
```

Reglas que aplica:
- `nombre`: requerido, mínimo 2 caracteres
- `email`: requerido, formato válido
- `password`: requerida, mínimo 8 caracteres

Esta capa existe porque la validación creció lo suficiente como para justificar sacarla del hook. En features simples, la validación puede vivir directamente en el hook sin necesidad de esta carpeta.

Ver: [`crearCuentaValidator.ts`](./crearCuentaValidator.ts)
