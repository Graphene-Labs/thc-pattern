---
inclusion: always
---

# THC-C en la célula ágil: proceso con BDD

THC-C encaja de forma natural con BDD cuando se aplica desde la fase de planificación. Los criterios de aceptación de QA se traducen directamente en fixtures del Composer: cada caso hoja del Test Plan tiene su carpeta de fixtures, y el maquetador puede probar ese escenario exacto cambiando una constante.

---

## Roles

| Rol | Responsabilidad |
|-----|----------------|
| Back | Expone los contratos de las APIs y los publica en Swagger |
| Back Apoyo | Apoya al equipo frontend con dudas sobre contratos, tiene acceso al ambiente de desarrollo |
| Front IMP | Implementa hooks y servicios reales, co-construye los fixtures con QA |
| Front GUI | Maqueta la UI contra los mocks, no depende del backend para trabajar |
| QA | Escribe las HUs con criterios BDD, estructura el Test Plan, co-construye los fixtures con Front IMP |

---

## Flujo general

### Planificación
- Back → publica Swagger con endpoints y todos los códigos de respuesta
- QA → escribe HUs y Test Plan en formato BDD
- Front IMP → genera los archivos `.types.ts` y entidades desde el Swagger

### Inicio del desarrollo
- QA + Front IMP → construyen los fixtures por escenario (una carpeta por caso hoja)
- QA + Front IMP → configuran el Composer apuntando al mock

### En paralelo (desbloqueado)
- Front GUI → maqueta contra mocks, cambia escenario cambiando `SCENARIO` en el Composer
- Front IMP → implementa servicios y hooks reales contra el Swagger

### Integración
- Front IMP → actualiza el Composer para apuntar a la implementación real
- QA → ejecuta los casos del Test Plan sobre la implementación real

El punto de sincronización crítico es tener los fixtures listos. Una vez que existen, el equipo trabaja en paralelo sin bloquearse.

---

## El Test Plan y su relación con los fixtures

El Test Plan se estructura en tres niveles: la vista o feature, los servicios que consume, y los casos por servicio. Cada caso hoja se convierte en una carpeta de fixtures.

```
Caso 1 — Vista: Crear cuenta
  Servicios relacionados:
    - POST /api/crear-cuenta
    - POST /api/enviar-verificacion-email

  Caso 1.1 — POST /api/crear-cuenta
    Caso 1.1.1 — Registro exitoso
      Given: el usuario completa todos los campos válidos
      When:  envía el formulario
      Then:  recibe confirmación y es redirigido al paso de verificación
      Response: 200

    Caso 1.1.2 — Email ya registrado
      Given: el usuario ingresa un email que ya existe
      When:  envía el formulario
      Then:  ve un mensaje de error indicando el email duplicado
      Response: 409 EMAIL_DUPLICADO

    Caso 1.1.3 — Error del servidor
      Given: el servicio no está disponible
      When:  el usuario envía el formulario
      Then:  ve un mensaje de error genérico
      Response: 500 SERVER_ERROR

  Caso 1.2 — POST /api/enviar-verificacion-email
    Caso 1.2.1 — Email enviado correctamente
      Given: el registro fue exitoso
      When:  el sistema intenta enviar el email de verificación
      Then:  el usuario ve la pantalla de confirmación
      Response: 200

    Caso 1.2.2 — Fallo en el envío
      Given: el servicio de email no está disponible
      When:  el sistema intenta enviar el email de verificación
      Then:  el usuario puede reintentar desde la pantalla de confirmación
      Response: 503 EMAIL_SERVICE_UNAVAILABLE
```

Los casos hoja (1.1.1, 1.1.2, 1.1.3, 1.2.1, 1.2.2) se traducen directamente en carpetas de fixtures:

```
fixtures/
  exitoso/
    crearCuenta.fixture.ts
    verificacionEmail.fixture.ts
  emailDuplicado/
    crearCuenta.fixture.ts
    verificacionEmail.fixture.ts
  errorServidor/
    crearCuenta.fixture.ts
    verificacionEmail.fixture.ts
  emailServiceUnavailable/
    crearCuenta.fixture.ts
    verificacionEmail.fixture.ts
```

Los fixtures están listos cuando existe una carpeta por cada caso hoja. Esa es la condición para que Front GUI empiece a maquetar.

---

## Reglas del proceso

1. **Los types vienen del Swagger, no se inventan.** Si hay discrepancia, el Swagger gana. La conversación se tiene con backend.

2. **Cada caso hoja del Test Plan tiene su carpeta de fixtures.** Un caso sin fixture es un escenario que la UI nunca fue probada.

3. **Los fixtures están tipados con la entidad.** Si el contrato cambia, TypeScript señala los fixtures rotos antes de que lleguen a producción.

4. **Los fixtures son realistas.** Datos vagos generan UIs que se ven bien en desarrollo y se rompen en producción.

5. **La Mock Library es un artefacto del equipo, no de Front IMP.** QA co-construye los fixtures porque son la traducción directa de los criterios de aceptación. Si QA no participó, los criterios y los mocks pueden estar desincronizados.

6. **El Composer siempre tiene un estado declarado.** En todo momento debe quedar claro si el feature está en modo mock o en modo real.
