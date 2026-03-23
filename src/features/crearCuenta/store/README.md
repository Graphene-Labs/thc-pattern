> También disponible en español: [README.es.md](./README.es.md)

# store/

Shared state with Zustand. Stores the created `Cuenta` after a successful registration.

```ts
// cuentaStore.ts
useCuentaStore() → { cuenta, setCuenta, clearCuenta }
```

The hook calls `setCuenta(cuentaCreada)` after registration succeeds. From that point, any component or feature that needs the account data can read it from the store without prop drilling or additional API calls.

This layer exists because the created `Cuenta` is needed in more than one place: the hook uses it to retry the verification email, and other components may need it to display user data.

If the state is only needed by one component, the store isn't necessary — a local hook is enough.

See: [`cuentaStore.ts`](./cuentaStore.ts)
