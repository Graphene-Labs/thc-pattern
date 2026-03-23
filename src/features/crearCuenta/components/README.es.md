# components/

La UI del feature completo. Maneja más estados que los niveles anteriores porque el hook expone más: `isEmailError`, `emailVerificacionError` y `reintentarEmail`.

```ts
const {
  formData, errors,
  isLoading, isSuccess, isEmailError,
  emailVerificacionError,
  updateField, registrar, reintentarEmail,
} = useCrearCuenta()
```

El componente sigue sin saber nada del negocio. Solo reacciona al estado que el hook expone:
- `isSuccess` → pantalla de confirmación
- `isEmailError` → pantalla de error con botón de reintento
- estado normal → formulario

Ver: [`CrearCuentaForm.tsx`](./CrearCuentaForm.tsx)
