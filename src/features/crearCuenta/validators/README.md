> También disponible en español: [README.es.md](./README.es.md)

# validators/

Local form validation before calling the service.

The hook calls `validarCrearCuenta(formData)` at the start of `registrar()`. If there are errors, it sets them and returns without making any HTTP call.

```ts
// crearCuentaValidator.ts
validarCrearCuenta(data: CrearCuentaFormData): CrearCuentaErrors
tieneErrores(errors: CrearCuentaErrors): boolean
```

Rules applied:
- `nombre`: required, minimum 2 characters
- `email`: required, valid format
- `password`: required, minimum 8 characters

This layer exists because the validation grew enough to justify extracting it from the hook. In simpler features, validation can live directly in the hook without needing this folder.

See: [`crearCuentaValidator.ts`](./crearCuentaValidator.ts)
