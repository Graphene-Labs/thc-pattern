> También disponible en español: [README.es.md](./README.es.md)

# hooks/

The feature orchestrator. At this level it coordinates more pieces than previous levels, but the interface it exposes to the component stays simple.

```ts
// what useCrearCuenta exposes to the component
{
  formData, errors,
  isLoading, isSuccess, isEmailError,
  emailVerificacionError,
  cuenta,
  updateField,
  registrar,
  reintentarEmail,
}
```

---

## Internal flow of `registrar()`

```
1. validarCrearCuenta(formData)              ← if errors, set and return
2. crearCuentaService.registrar()            ← calls the Composer
3. setCuenta(cuentaCreada)                   ← saves to store
4. crearCuentaService.enviarVerificacionEmail()
5. setStatus('success') | setStatus('emailError')
```

The component calls `registrar()` and reacts to state. It knows nothing about this flow.

---

## `reintentarEmail()`

Exposed for the `emailServiceUnavailable` case. If the verification email fails, the component can show a retry button that calls this function. The account is already created and saved in the store — only the email send is retried.

See: [`useCrearCuenta.ts`](./useCrearCuenta.ts)
