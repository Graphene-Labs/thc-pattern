# Patrón THC / THC-C

Basado en el [Patrón JONA](https://github.com/Jofrantoba-Coding/patron-frontend-jona--) de Jonathan Franchesco Torres Baca.

> THC no organiza proyectos. Organiza features.

No reemplaza tu arquitectura macro. Vive dentro de ella y organiza las piezas pequeñas: un formulario, un flujo, una pantalla.

---

## ¿Por qué existe?

Cuando construyes un feature de frontend siempre necesitas las mismas tres cosas: un lugar para los datos, un lugar para la lógica, y un lugar para la UI. El problema es que sin estructura todo termina mezclado en el componente, y con demasiada estructura nadie la mantiene.

THC propone lo mínimo necesario: tres capas con nombres que mapean directamente a las herramientas que ya usas.

La variante **THC-C** agrega el Composer — un punto de intercambio que permite al maquetador trabajar contra mocks tipados mientras el implementador construye los servicios reales. Los dos trabajan en paralelo sin bloquearse.

![THC y THC-C](public/THC-THC-C.png)

---

## Las capas

**THC** — la base. Siempre presente.

| Capa | Responsabilidad |
|------|----------------|
| Types | Contratos de datos. Sin lógica, sin llamadas, sin renderizado. |
| Hooks | Orquestador del feature. Estado, validaciones, llamadas a servicios. |
| Components | Renderiza y captura interacciones. Sin lógica de negocio. |

**THC-C** — agrega el Composer cuando el maquetador necesita trabajar sin depender del backend.

| Capa | Responsabilidad |
|------|----------------|
| Composer | Punto de intercambio entre la implementación real y el mock. |
| Fixtures | Datos tipados por escenario. Una carpeta por caso del Test Plan. |

![Flujo del Composer](public/Composer_flow.png)

---

## Escalado gradual

El patrón empieza simple y crece solo cuando es necesario.

| Nivel | Qué agrega | Carpeta de referencia |
|-------|-----------|----------------------|
| 1 | THC básico — 3 archivos | [`src/features/nivel1/`](src/features/nivel1/README.es.md) |
| 2 | Composer + un escenario | [`src/features/nivel2/`](src/features/nivel2/README.es.md) |
| 3 | Múltiples escenarios | [`src/features/nivel3/`](src/features/nivel3/README.es.md) |
| 4 | Capa de servicios + `composeConfig` global | [`src/features/nivel4/`](src/features/nivel4/README.es.md) |
| 5 | Store, validators, mappers, múltiples endpoints | [`src/features/crearCuenta/`](src/features/crearCuenta/README.es.md) |

---

## Por aquí empiezas

Si es tu primera vez con el patrón → [`src/features/nivel1/`](src/features/nivel1/README.es.md)

Si quieres entender el Composer → [`src/features/nivel2/`](src/features/nivel2/README.es.md)

Si quieres ver el flujo completo con BDD y múltiples escenarios → [`src/features/crearCuenta/`](src/features/crearCuenta/README.es.md)

Si quieres entender cómo se controla todo desde un solo lugar → [`src/config/`](src/config/README.es.md)

---

## Estructura del repo

```
src/
├── config/          ← composeConfig global (THC-C variante B)
└── features/
    ├── nivel1/      ← THC básico
    ├── nivel2/      ← THC-C variante A, un escenario
    ├── nivel3/      ← THC-C variante A, múltiples escenarios
    ├── nivel4/      ← THC-C variante B con servicios
    └── crearCuenta/ ← THC-C completo (nivel 5)
```

Cada carpeta tiene su propio README con el detalle de lo que vive ahí.

---

## THC-C con BDD

Los fixtures son la traducción directa de los criterios de aceptación de QA. Cada caso hoja del Test Plan tiene su carpeta. Cuando los fixtures están listos, el maquetador y el implementador trabajan en paralelo sin bloquearse.

![THC-C y BDD](public/THC-BDD-framework.png)

Ver el flujo completo en [`src/features/crearCuenta/fixtures/`](src/features/crearCuenta/fixtures/README.es.md).

---

Origen: evolución del [Patrón JONA](https://github.com/Jofrantoba-Coding/patron-frontend-jona--) especializada para el ecosistema de librerías reactivas modernas — React, Vue, Alpine.
