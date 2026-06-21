import type { ReporteTab } from './typesReportes';

const TABS: { id: ReporteTab; label: string; description: string }[] = [
  { id: 'Morosos', label: 'Control de Morosidad', description: 'Listado de residentes con deudas pendientes.'         },
  { id: 'Balance', label: 'Balance General',       description: 'Libro mayor de ingresos y egresos aprobados.' },
];

interface Props {
  active: ReporteTab;
  onSelect: (tab: ReporteTab) => void;
}

export function ReportesTabs({ active, onSelect }: Props) {
  const current = TABS.find(t => t.id === active)!;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 border-b border-[#e0e0e0]">
        {TABS.map(t => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="px-5 py-2 text-sm font-medium transition-colors relative"
              style={{
                color:        isActive ? '#308C58' : '#6b7280',
                borderBottom: isActive ? '2px solid #308C58' : '2px solid transparent',
                marginBottom: '-1px',
                background:   'none',
                cursor:       'pointer',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-[#4b5563]">{current.description}</p>
    </div>
  );
}