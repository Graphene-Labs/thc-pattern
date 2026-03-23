> También disponible en español: [README.es.md](./README.es.md)

# fixtures/emailServiceUnavailable/

Covers case 1.2.2 of the Test Plan: registration succeeded but the email service is unavailable.

```
emailServiceUnavailable/
├── crearCuenta.fixture.ts        ← 201, account created (successful registration)
└── verificacionEmail.fixture.ts  ← 503 EMAIL_SERVICE_UNAVAILABLE
```

The most interesting scenario in the feature: two endpoints, two different results in the same flow. Registration succeeds — the account is created and saved to the store — but the verification email fails.

The hook detects the error on the second endpoint, sets `status = 'emailError'`, and exposes `reintentarEmail()`. The component shows an error screen with a retry button instead of the form.

This is the only scenario where `reintentarEmail()` makes sense. Without this fixture, that branch of the hook could never be tested during development.
