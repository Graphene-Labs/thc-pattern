# fixtures/

Cuatro escenarios. Cada carpeta es un caso hoja del Test Plan, co-construido por QA y Front IMP.

```
fixtures/
├── exitoso/
│   ├── crearCuenta.fixture.ts         ← 201, cuenta creada
│   └── verificacionEmail.fixture.ts   ← 200, email enviado
├── emailDuplicado/
│   ├── crearCuenta.fixture.ts         ← 409 EMAIL_DUPLICADO
│   └── verificacionEmail.fixture.ts   ← no se llega a este endpoint
├── errorServidor/
│   ├── crearCuenta.fixture.ts         ← 500 SERVER_ERROR
│   └── verificacionEmail.fixture.ts   ← no se llega a este endpoint
└── emailServiceUnavailable/
    ├── crearCuenta.fixture.ts         ← 201, cuenta creada (registro exitoso)
    └── verificacionEmail.fixture.ts   ← 503 EMAIL_SERVICE_UNAVAILABLE
```

Cada escenario tiene un archivo por endpoint. El mock (`crearCuentaService.mock.ts`) los carga por separado — así `emailServiceUnavailable` puede devolver éxito en el registro y error en el email, replicando exactamente el comportamiento real.

Todos los fixtures están tipados:
- `crearCuenta.fixture.ts` → `ApiResponse<Cuenta>`
- `verificacionEmail.fixture.ts` → `ApiResponse<VerificacionEmailResponse>`

Si los tipos cambian, TypeScript señala los fixtures rotos en compilación.

---

## Relación con el Test Plan BDD

Cada carpeta aquí corresponde a un caso hoja del Test Plan:

| Carpeta | Caso | Escenario |
|---------|------|-----------|
| `exitoso/` | 1.1.1 + 1.2.1 | Registro y email exitosos |
| `emailDuplicado/` | 1.1.2 | Email ya registrado |
| `errorServidor/` | 1.1.3 | Error del servidor |
| `emailServiceUnavailable/` | 1.2.2 | Fallo en el envío del email |

Los fixtures están listos cuando existe una carpeta por cada caso hoja. Esa es la condición para que Front GUI empiece a maquetar.
