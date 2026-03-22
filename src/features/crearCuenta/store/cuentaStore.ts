import { create } from 'zustand'
import type { Cuenta } from '../types/crearCuenta.types'

interface CuentaStore {
  cuenta: Cuenta | null
  setCuenta: (cuenta: Cuenta) => void
  clearCuenta: () => void
}

export const useCuentaStore = create<CuentaStore>(set => ({
  cuenta: null,
  setCuenta: (cuenta) => set({ cuenta }),
  clearCuenta: () => set({ cuenta: null }),
}))
