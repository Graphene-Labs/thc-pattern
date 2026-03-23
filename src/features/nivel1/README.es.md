# Nivel 1 — THC básico

Tres archivos, tres responsabilidades. Sin Composer, sin mocks, sin capas adicionales.

```
nivel1/
├── types/crearCuenta.types.ts   ← contratos de datos
├── hooks/useCrearCuenta.ts      ← lógica y estado
└── components/CrearCuentaForm.tsx
```

El hook llama directamente a la API. No hay punto de intercambio — cuando el backend no está disponible, el feature no funciona. Eso está bien para primeras iteraciones o cuando el equipo tiene acceso al backend durante el desarrollo.

---

## Qué hace cada capa

**[`types/`](./types/)** — define la forma de los datos: el formulario, los errores, la entidad `Cuenta` y los tipos de respuesta de la API.

**[`hooks/useCrearCuenta.ts`](./hooks/useCrearCuenta.ts)** — maneja el estado del formulario, llama a `fetch('/api/crear-cuenta')` directamente y expone `{ formData, errors, isLoading, isSuccess, updateField, registrar }` al componente.

**[`components/CrearCuentaForm.tsx`](./components/CrearCuentaForm.tsx)** — renderiza el formulario. No sabe nada de la API ni del estado interno. Solo consume lo que el hook expone.

---

## Cuándo subir al siguiente nivel

Cuando el maquetador necesite trabajar sin depender del backend → [Nivel 2](../nivel2/README.es.md) agrega el Composer.
