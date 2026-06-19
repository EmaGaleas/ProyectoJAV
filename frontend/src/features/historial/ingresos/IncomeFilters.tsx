import type { PaymentType, IncomeStatus } from './types'

export interface Filters {
  paymentType: PaymentType | ''
  status: IncomeStatus | ''
  dateFrom: string
  dateTo: string
}
export const DEFAULT_FILTERS: Filters = { paymentType: '', status: '', dateFrom: '', dateTo: '' }

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  onApply: () => void
}


export function IncomeFilters({ filters, onChange, onApply }: Props) {
  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value })
  const hasAny = filters.paymentType ||filters.status|| filters.dateFrom || filters.dateTo
  const handleClear = () => onChange(DEFAULT_FILTERS)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] p-5 flex flex-col h-full" style={{ minWidth: 220 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 20 }}>Filtros</span>
      
      {/* Tipo de pago */}
      <FilterGroup label="Tipo de pago">
        {(['Multa', 'Mensualidad', 'Conexión'] as PaymentType[]).map(type => (
          <CheckRow key={type} label={type} checked={filters.paymentType === type}
            onChange={() => set('paymentType', filters.paymentType === type ? '' : type)} />
        ))}
      </FilterGroup>

      {/* Estado */}
      <FilterGroup label="Estado">
        {(['Procesado', 'En revisión', 'Rechazado'] as IncomeStatus[]).map(s => (
          <CheckRow key={s} label={s} checked={filters.status === s}
            onChange={() => set('status', filters.status === s ? '' : s)} />
        ))}
      </FilterGroup>

      {/* Fecha */}
      <FilterGroup label="Rango de fecha">
        <DateInput label="Desde" value={filters.dateFrom} onChange={v => set('dateFrom', v)} />
        <DateInput label="Hasta" value={filters.dateTo}   onChange={v => set('dateTo',   v)} max={filters.dateTo} />
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

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
        >
          Aplicar filtros
        </button>

        {/* Trash — visible only when there's something to clear */}
        {hasAny && (
          <button
            onClick={handleClear}
            title="Limpiar filtros"
            className="flex items-center justify-center rounded-xl hover:opacity-80 transition-opacity shrink-0"
            style={{ width: 40, background: '#fde8e8', border: 'none', cursor: 'pointer' }}
          >
            {/* Trash icon (inline SVG, no lucide dependency needed) */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── sub-componentes locales ──────────────────────────────────────────────────

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{label}</span>
      {children}
    </div>
  )
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div onClick={onChange}
        className="flex items-center justify-center rounded-full shrink-0 transition-colors cursor-pointer"
        style={{ width: 20, height: 20, border: `2px solid ${checked ? '#308C58' : 'rgba(0,0,0,0.2)'}`, background: checked ? '#308C58' : '#fff' }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4.5 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 13, color: '#1A1A1A' }}>{label}</span>
    </label>
  )
}

function DateInput({ label, value, onChange, max }: { label: string; value: string; onChange: (v: string) => void; max?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div className="relative">
        <input
          type="date"
          value={value}
          max={max || undefined}
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
