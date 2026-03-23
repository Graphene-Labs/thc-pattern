> También disponible en español: [README.es.md](./README.es.md)

# mappers/

Transforms the raw backend response to the feature's internal entity.

```ts
// crearCuentaMapper.ts
CuentaApiRaw           ← shape returned by the backend (snake_case)
mapCuentaFromApi(raw)  ← converts to Cuenta (camelCase)
```

The mapper is used in the real service (`crearCuentaService.ts`) when the backend returns `created_at` and the frontend expects `createdAt`. The mock doesn't need it — fixtures already have the correct internal format.

This layer exists when there's a mismatch between the backend contract and the internal entity. If the backend already returns camelCase or the format matches exactly, this folder isn't needed.

See: [`crearCuentaMapper.ts`](./crearCuentaMapper.ts)
