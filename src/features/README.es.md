# features/

Cada carpeta es una implementación del mismo feature (`crearCuenta`) en un nivel distinto del patrón THC / THC-C. Sirven como referencia progresiva — de lo más simple a lo más completo.

| Carpeta | Nivel | Descripción |
|---------|-------|-------------|
| [`nivel1/`](./nivel1/README.es.md) | 1 | THC básico. Tres archivos, llamada directa a la API. |
| [`nivel2/`](./nivel2/README.es.md) | 2 | THC-C Variante A. Composer + un escenario de fixture. |
| [`nivel3/`](./nivel3/README.es.md) | 3 | THC-C Variante A. Composer + múltiples escenarios. |
| [`nivel4/`](./nivel4/README.es.md) | 4 | THC-C Variante B. Capa de servicios + `composeConfig` global. |
| [`crearCuenta/`](./crearCuenta/README.es.md) | 5 | THC-C completo. Store, validators, mappers, dos endpoints, cuatro escenarios. |

Cada nivel agrega solo lo necesario respecto al anterior. El componente no cambia entre niveles.
