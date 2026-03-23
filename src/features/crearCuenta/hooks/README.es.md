# hooks/

El orquestador del feature. En este nivel coordina más piezas que en los anteriores, pero la interfaz que expone al componente sigue siendo simple.

```ts
// lo que expone useCrearCuenta al componente
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

## Flujo interno de `registrar()`

```
1. validarCrearCuenta(formData)       ← si hay errores, setea y retorna
2. crearCuentaService.registrar()     ← llama al Composer
3. setCuenta(cuentaCreada)            ← guarda en el store
4. crearCuentaService.enviarVerificacionEmail()
5. setStatus('success') | setStatus('emailError')
```

El componente llama a `registrar()` y reacciona al estado. No sabe nada de este flujo.

---

## `reintentarEmail()`

Se expone para el caso `emailServiceUnavailable`. Si el email de verificación falla, el componente puede mostrar un botón de reintento que llama a esta función. La cuenta ya está creada y guardada en el store — solo se reintenta el envío del email.

Ver: [`useCrearCuenta.ts`](./useCrearCuenta.ts)
