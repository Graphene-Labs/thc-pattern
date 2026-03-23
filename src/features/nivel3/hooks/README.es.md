# hooks/

Igual que Nivel 2, pero el Composer ahora maneja múltiples escenarios.

---

## registrarComposedService.ts — el Composer

```ts
const fixtures = { exitoso, emailDuplicado, errorServidor }
const SCENARIO: keyof typeof fixtures = 'exitoso'
```

`SCENARIO` está tipado como `keyof typeof fixtures` — TypeScript no deja escribir un nombre de escenario que no exista. Si se agrega una carpeta de fixture nueva y no se registra aquí, el tipo lo detecta.

Ver: [`registrarComposedService.ts`](./registrarComposedService.ts)

---

## useCrearCuenta.ts

Sin cambios respecto al Nivel 2. El hook no sabe cuántos escenarios existen — eso es responsabilidad del Composer.

Ver: [`useCrearCuenta.ts`](./useCrearCuenta.ts)
