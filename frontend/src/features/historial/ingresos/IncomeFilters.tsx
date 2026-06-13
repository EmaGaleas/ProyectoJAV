import type { PaymentType, IncomeStatus } from './types'

export interface Filters {
  paymentType: PaymentType | ''
  status: IncomeStatus | ''
  dateFrom: string
  dateTo: string
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  onApply: () => void
}

export const DEFAULT_FILTERS: Filters = { paymentType: '', status: '', dateFrom: '', dateTo: '' }

export function IncomeFilters({ filters, onChange, onApply }: Props) {
  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value })

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

      <div className="flex-1" />

      <button onClick={onApply}
        className="w-full py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}>
        Aplicar filtros
      </button>
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
