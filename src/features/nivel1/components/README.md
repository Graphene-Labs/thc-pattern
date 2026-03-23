> También disponible en español: [README.es.md](./README.es.md)

# components/

The UI layer. Renders the form and captures interactions. No business logic, no service calls.

The component consumes the hook through a single line:

```ts
const { formData, errors, isLoading, isSuccess, updateField, registrar } = useCrearCuenta()
```

Everything it needs to know about the feature's state comes from there. It doesn't know if there's a Composer, a mock, or how many layers are below the hook.

This separation is the key of the pattern: the component doesn't change between Level 1 and Level 5. Only what's inside the hook changes.

See: [`CrearCuentaForm.tsx`](./CrearCuentaForm.tsx)
