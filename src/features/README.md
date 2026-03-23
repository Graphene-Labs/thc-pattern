> También disponible en español: [README.es.md](./README.es.md)

# features/

Each folder is an implementation of the same feature (`crearCuenta`) at a different level of the THC / THC-C pattern. They serve as a progressive reference — from simplest to most complete.

| Folder | Level | Description |
|--------|-------|-------------|
| [`nivel1/`](./nivel1/README.md) | 1 | Basic THC. Three files, direct API call. |
| [`nivel2/`](./nivel2/README.md) | 2 | THC-C Variant A. Composer + one fixture scenario. |
| [`nivel3/`](./nivel3/README.md) | 3 | THC-C Variant A. Composer + multiple scenarios. |
| [`nivel4/`](./nivel4/README.md) | 4 | THC-C Variant B. Service layer + global `composeConfig`. |
| [`crearCuenta/`](./crearCuenta/README.md) | 5 | Full THC-C. Store, validators, mappers, two endpoints, four scenarios. |

Each level adds only what the previous one was missing. The component does not change between levels.
