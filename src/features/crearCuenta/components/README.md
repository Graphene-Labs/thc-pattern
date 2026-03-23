> También disponible en español: [README.es.md](./README.es.md)

# components/

The feature's UI. Handles more states than previous levels because the hook exposes more: `isEmailError`, `emailVerificacionError`, and `reintentarEmail`.

```ts
const {
  formData, errors,
  isLoading, isSuccess, isEmailError,
  emailVerificacionError,
  updateField, registrar, reintentarEmail,
} = useCrearCuenta()
```

The component still knows nothing about the business. It only reacts to the state the hook exposes:
- `isSuccess` → confirmation screen
- `isEmailError` → error screen with retry button
- default → form

See: [`CrearCuentaForm.tsx`](./CrearCuentaForm.tsx)
