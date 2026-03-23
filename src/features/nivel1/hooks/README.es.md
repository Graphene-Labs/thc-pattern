# hooks/

El orquestador del feature. Maneja estado, llama servicios, expone una interfaz limpia al componente.

El componente no sabe cómo funciona el negocio. El hook no sabe cómo se ve la pantalla.

```ts
// useCrearCuenta.ts — lo que expone al componente
{ formData, errors, isLoading, isSuccess, updateField, registrar }
```

En este nivel (THC básico), el hook llama directamente a `fetch`. No hay Composer ni mock — si el backend no está disponible, el feature no funciona.

Ver: [`useCrearCuenta.ts`](./useCrearCuenta.ts)

---

Cuando el feature necesite trabajar sin backend, el hook no cambia. Solo se agrega `registrarComposedService.ts` al lado y el hook importa de ahí en lugar de llamar a `fetch` directamente. Ver [Nivel 2](../nivel2/hooks/README.es.md).
