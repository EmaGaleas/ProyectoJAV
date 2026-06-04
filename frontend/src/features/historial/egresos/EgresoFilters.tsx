export interface EgresoFilterValues {
  search:   string
  dateFrom: string
  dateTo:   string
}

export const DEFAULT_EGRESO_FILTERS: EgresoFilterValues = { search: '', dateFrom: '', dateTo: '' }

interface Props {
  filters:  EgresoFilterValues
  onChange: (f: EgresoFilterValues) => void
  onApply:  () => void
}

export function EgresoFilters({ filters, onChange, onApply }: Props) {
  const set = (key: keyof EgresoFilterValues, value: string) =>
    onChange({ ...filters, [key]: value })

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] p-5 flex flex-col h-full"
      style={{ minWidth: 220 }}
    >
      <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 20 }}>Filtros</span>

      {/* Búsqueda */}
      <FilterGroup label="Buscar">
        <input
          type="text"
          placeholder="Código, registrado por, receptor, DNI..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          className="w-full h-9 px-3 text-sm rounded-xl border border-[rgba(0,0,0,0.12)] bg-white focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30"
          style={{ color: filters.search ? '#1A1A1A' : undefined }}
        />
      </FilterGroup>

      {/* Rango de fecha */}
      <FilterGroup label="Rango de fecha">
        <DateInput label="Desde" value={filters.dateFrom} onChange={v => set('dateFrom', v)} />
        <DateInput label="Hasta" value={filters.dateTo}   onChange={v => set('dateTo',   v)} />
        {(filters.dateFrom || filters.dateTo) && (
          <button
            onClick={() => onChange({ ...filters, dateFrom: '', dateTo: '' })}
            style={{ fontSize: 11, color: '#8EBFA3', textAlign: 'left', marginTop: 2 }}
            className="hover:text-[#308C58] transition-colors"
          >
            Limpiar fechas
          </button>
        )}
      </FilterGroup>

      <div className="flex-1" />

      <button
        onClick={onApply}
        className="w-full py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
      >
        Aplicar filtros
      </button>
    </div>
  )
}

// ─── sub-componentes ──────────────────────────────────────────────────────────

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{label}</span>
      {children}
    </div>
  )
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-9 px-3 text-sm rounded-xl border border-[rgba(0,0,0,0.12)] bg-white focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30"
          style={{ color: value ? '#1A1A1A' : '#B0C8BA' }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full hover:bg-[#F0FAF4] transition-colors"
            style={{ width: 18, height: 18, color: '#8EBFA3', fontSize: 14, lineHeight: 1 }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
