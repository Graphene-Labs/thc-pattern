# Nivel 4 — THC-C Variante B, con capa de servicios

Se introduce `services/` y `composeConfig.ts` global. El Composer ya no intercambia una función suelta — intercambia el objeto de servicio completo. Todos los métodos se intercambian de una vez.

```
src/config/composeConfig.ts          ← control global: useMock + scenario por feature

nivel4/
├── types/crearCuenta.types.ts
├── services/
│   ├── crearCuentaService.ts        ← implementación real
│   ├── crearCuentaService.mock.ts   ← devuelve fixtures tipados
│   └── composer.ts                  ← switch: real vs mock
├── hooks/useCrearCuenta.ts          ← importa de services/composer
├── fixtures/
│   ├── exitoso/crearCuenta.fixture.ts
│   ├── emailDuplicado/crearCuenta.fixture.ts
│   └── errorServidor/crearCuenta.fixture.ts
└── components/CrearCuentaForm.tsx
```

---

## Qué hace cada capa

**[`src/config/composeConfig.ts`](../../../config/composeConfig.ts)** — un solo lugar para controlar el estado de todos los features del proyecto. Para cambiar de mock a real, o cambiar el escenario activo, solo se edita aquí.

**[`services/`](./services/)** — tres archivos con responsabilidades claras. Ver el README de esa carpeta.

**[`hooks/useCrearCuenta.ts`](./hooks/useCrearCuenta.ts)** — importa `crearCuentaService` desde `services/composer`. No sabe si es real o mock.

**[`fixtures/`](./fixtures/)** — igual que Nivel 3. Los escenarios no cambian, solo cambia quién los consume (ahora es `crearCuentaService.mock.ts` en lugar del Composer de hooks).

---

## Cuándo subir al siguiente nivel

Cuando el feature necesite validaciones locales, transformación de datos del backend, estado compartido entre componentes, o un segundo endpoint → [crearCuenta](../crearCuenta/README.es.md) muestra el nivel completo.
