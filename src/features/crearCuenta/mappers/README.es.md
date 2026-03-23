# mappers/

Transforma la respuesta raw del backend a la entidad interna del feature.

```ts
// crearCuentaMapper.ts
CuentaApiRaw          ← forma que devuelve el backend (snake_case)
mapCuentaFromApi(raw) ← convierte a Cuenta (camelCase)
```

El mapper se usa en el servicio real (`crearCuentaService.ts`) cuando el backend devuelve `created_at` y el frontend espera `createdAt`. El mock no lo necesita — los fixtures ya tienen el formato interno correcto.

Esta capa existe cuando hay una discrepancia entre el contrato del backend y la entidad interna. Si el backend ya devuelve camelCase o el formato coincide exactamente, esta carpeta no es necesaria.

Ver: [`crearCuentaMapper.ts`](./crearCuentaMapper.ts)
