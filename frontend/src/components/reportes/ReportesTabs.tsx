import type { ReporteTab } from './typesReportes';

const TABS_META = [
  { label: 'Morosos' as ReporteTab, description: 'Listado de residentes con deudas pendientes.' },
  { label: 'Balance' as ReporteTab, description: 'Libro mayor de ingresos y egresos aprobados.' }
];

export function ReportesTabs({ active, onSelect }: { active: ReporteTab, onSelect: (s: ReporteTab) => void }) {
  const current = TABS_META.find(t => t.label === active)!;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 border-b border-[#e0e0e0]">
        {TABS_META.map(t => {
          const isActive = t.label === active;
          return (
            <button
              key={t.label}
              onClick={() => onSelect(t.label)}
              className="px-5 py-2 text-sm font-medium transition-colors relative"
              style={{
                color: isActive ? '#308C58' : '#6b7280',
                borderBottom: isActive ? '2px solid #308C58' : '2px solid transparent',
                marginBottom: '-1px',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              {t.label === 'Balance' ? 'Balance General' : 'Control de Morosidad'}
            </button>
          )
        })}
      </div>
      <p className="text-sm text-[#4b5563]">{current.description}</p>
    </div>
  );
}