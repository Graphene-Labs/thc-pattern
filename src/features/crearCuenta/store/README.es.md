# store/

Estado compartido con Zustand. Guarda la `Cuenta` creada después de un registro exitoso.

```ts
// cuentaStore.ts
useCuentaStore() → { cuenta, setCuenta, clearCuenta }
```

El hook llama a `setCuenta(cuentaCreada)` después de que el registro es exitoso. Desde ese momento, cualquier componente o feature que necesite los datos de la cuenta puede leerlos del store sin prop drilling ni llamadas adicionales a la API.

Esta capa existe porque la `Cuenta` creada se necesita en más de un lugar: el hook la usa para reintentar el envío de email de verificación, y otros componentes pueden necesitarla para mostrar datos del usuario.

Si el estado solo lo necesita un componente, no hace falta el store — el hook local es suficiente.

Ver: [`cuentaStore.ts`](./cuentaStore.ts)
