import { CrearCuentaForm as Nivel1 } from './features/nivel1'
import { CrearCuentaForm as Nivel2 } from './features/nivel2'
import { CrearCuentaForm as Nivel3 } from './features/nivel3'
import { CrearCuentaForm as Nivel4 } from './features/nivel4'
import { CrearCuentaForm as Nivel5 } from './features/crearCuenta'

const niveles = [
  {
    nivel: 1,
    titulo: 'THC básico',
    descripcion: 'Types · Hooks · Components',
    detalle: 'Llamada directa a la API. Sin Composer, sin mock. Suficiente para la mayoría de los features.',
    archivos: ['types/crearCuenta.types.ts', 'hooks/useCrearCuenta.ts', 'components/CrearCuentaForm.tsx'],
    form: <Nivel1 />,
  },
  {
    nivel: 2,
    titulo: 'THC-C variante A — un escenario',
    descripcion: 'Types · Hooks · Composer · Components',
    detalle: 'El Composer vive en hooks/ e intercambia una función suelta. Un solo escenario de fixture.',
    archivos: ['types/', 'hooks/registrarComposedService.ts', 'hooks/useCrearCuenta.ts', 'fixtures/exitoso/', 'components/'],
    form: <Nivel2 />,
  },
  {
    nivel: 3,
    titulo: 'THC-C variante A — múltiples escenarios',
    descripcion: 'Types · Hooks · Composer · Components',
    detalle: 'Mismo Composer en hooks/, pero con múltiples carpetas de fixtures. Cambia SCENARIO para probar cada caso.',
    archivos: ['hooks/registrarComposedService.ts', 'fixtures/exitoso/', 'fixtures/emailDuplicado/', 'fixtures/errorServidor/'],
    form: <Nivel3 />,
  },
  {
    nivel: 4,
    titulo: 'THC-C variante B — con servicios',
    descripcion: 'Types · Hooks · Services · Composer · Components',
    detalle: 'El Composer vive en services/ e intercambia el objeto de servicio completo. composeConfig controla el estado globalmente.',
    archivos: ['services/crearCuentaService.ts', 'services/crearCuentaService.mock.ts', 'services/composer.ts', 'config/composeConfig.ts'],
    form: <Nivel4 />,
  },
  {
    nivel: 5,
    titulo: 'THC-C completo',
    descripcion: 'Types · Validators · Mappers · Services · Composer · Store · Hooks · Components',
    detalle: 'Todas las capas opcionales activas. Validación local, mapper de entidad, store global con Zustand, dos endpoints orquestados en el hook.',
    archivos: ['validators/crearCuentaValidator.ts', 'mappers/crearCuentaMapper.ts', 'store/cuentaStore.ts', 'fixtures/exitoso/', 'fixtures/emailDuplicado/', 'fixtures/errorServidor/', 'fixtures/emailServiceUnavailable/'],
    form: <Nivel5 />,
  },
]

function NivelCard({ nivel, titulo, descripcion, detalle, archivos, form }: typeof niveles[0]) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">
            Nivel {nivel}
          </span>
        </div>
        <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>
        <p className="text-xs font-mono text-violet-600 mt-0.5">{descripcion}</p>
        <p className="text-sm text-gray-500 mt-2">{detalle}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {archivos.map(f => (
            <span key={f} className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2 py-0.5 rounded font-mono">
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6">
        {form}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Patrón THC / THC-C</h1>
          <p className="text-gray-500 mt-2">
            5 niveles de complejidad del mismo feature — <span className="font-medium text-gray-700">Crear cuenta</span>
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {niveles.map(n => <NivelCard key={n.nivel} {...n} />)}
        </div>
      </div>
    </div>
  )
}

export default App
