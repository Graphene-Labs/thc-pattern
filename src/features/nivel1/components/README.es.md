# components/

La capa de UI. Renderiza el formulario y captura interacciones. Sin lógica de negocio, sin llamadas a servicios.

El componente consume el hook a través de una sola línea:

```ts
const { formData, errors, isLoading, isSuccess, updateField, registrar } = useCrearCuenta()
```

Todo lo que necesita saber sobre el estado del feature viene de ahí. No sabe si hay un Composer, si hay un mock, ni cuántas capas hay debajo del hook.

Esta separación es la clave del patrón: el componente no cambia entre Nivel 1 y Nivel 5. Solo cambia lo que hay dentro del hook.

Ver: [`CrearCuentaForm.tsx`](./CrearCuentaForm.tsx)
