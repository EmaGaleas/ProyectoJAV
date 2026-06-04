  import type { EgresoStatus, TabMeta } from './types'
  
  interface Props {
    tabs:        TabMeta[]
    active:      EgresoStatus
    counts:      Record<EgresoStatus, number>
    onSelect:    (s: EgresoStatus) => void
  }
  
  export function EgresoTabs({ tabs, active, counts, onSelect }: Props) {
    const current = tabs.find(t => t.label === active)!
  
    return (
      <div className="flex flex-col gap-2">
        {/* Tab bar */}
        <div className="flex gap-2 border-b border-[#e0e0e0]">
          {tabs.map(t => {
            const isActive = t.label === active
            return (
              <button
                key={t.label}
                onClick={() => onSelect(t.label)}
                className="px-5 py-2 text-sm font-medium transition-colors relative"
                style={{
                  color:        isActive ? '#308C58' : '#6b7280',
                  borderBottom: isActive ? '2px solid #308C58' : '2px solid transparent',
                  marginBottom: '-1px',
                  background:   'none',
                  cursor:       'pointer',
                }}
              >
                {t.label === 'Aprobado'  ? 'Aprobados'  :
                 t.label === 'Pendiente' ? 'Pendientes' : 'Rechazados'}
                <span
                  className="ml-2 rounded-full px-2 py-0.5 text-xs"
                  style={{
                    background: isActive ? '#e6f3ec' : '#f3f4f6',
                    color:      isActive ? '#308C58' : '#6b7280',
                  }}
                >
                  {counts[t.label]}
                </span>
              </button>
            )
          })}
        </div>
  
        {/* Description */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-[#4b5563]">{current.description}</p>
          {current.note && (
            <p className="text-xs text-[#9ca3af] italic">{current.note}</p>
          )}
        </div>
      </div>
    )
  }
