export const composeConfig = {
  crearCuenta: {
    useMock: true,
    scenario: 'exitoso',
  },
} as const

export type FeatureKey = keyof typeof composeConfig
