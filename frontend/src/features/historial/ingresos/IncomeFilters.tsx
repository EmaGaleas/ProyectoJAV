import { useRef } from 'react' 
import type { PaymentType, IncomeStatus } from './types'
import { fmtDate } from './types' 
import { Calendar, X } from 'lucide-react'

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
  // Eliminamos onApply
}

export function IncomeFilters({ filters, onChange }: Props) {
  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value })
  // Verifica si algún filtro tiene un valor diferente al por defecto
  const hasAny = filters.paymentType !== '' || filters.status !== '' || filters.dateFrom !== '' || filters.dateTo !== ''
  
  const handleClear = () => onChange(DEFAULT_FILTERS)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] p-5 flex flex-col h-full" style={{ minWidth: 220 }}>
      
      {/* Título y Enlace "Quitar Filtros" alineados en la misma fila */}
      <div className="flex justify-between items-center mb-5">
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Filtros</span>
        {hasAny && (
          <button
            onClick={handleClear}
            style={{ 
              color: '#FF0000', 
              textDecoration: 'underline', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: 13, 
              padding: 0 
            }}
          >
            Quitar Filtros
          </button>
        )}
      </div>
      
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
      </FilterGroup>

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

// ─── Componente DateInput Modificado ──────────────────────────────────────────

function DateInput({ label, value, onChange, max }: { label: string; value: string; onChange: (v: string) => void; max?: string }) {
  // Referencia para forzar la apertura del calendario nativo
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpenPicker = () => {
    try {
      inputRef.current?.showPicker()
    } catch (e) {
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </span>
      
      {/* Contenedor principal: ahora tiene cursor-pointer y ejecuta handleOpenPicker */}
      <div 
        onClick={handleOpenPicker}
        className="relative w-full h-9 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white hover:border-[#308C58] transition-colors overflow-hidden flex items-center cursor-pointer"
      >
        <input
          ref={inputRef}
          type="date"
          value={value}
          max={max || undefined}
          onChange={e => onChange(e.target.value)}
          // onClick directo al input para evitar doble propagación o bloqueos
          onClick={e => {
            try { e.currentTarget.showPicker() } catch(err) {}
          }}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 10
          }}
        />

        <div className="flex items-center w-full h-full pointer-events-none px-3 gap-2">
          <Calendar size={16} style={{ color: '#8EBFA3' }} />
          <span className="text-sm truncate" style={{ color: value ? '#1A1A1A' : '#B0C8BA' }}>
            {value ? fmtDate(value) : 'Seleccionar...'}
          </span>
        </div>
        
        {value && (
          <button
            type="button"
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              onChange(''); 
            }}
            className="absolute right-2 flex items-center justify-center rounded-full hover:bg-[#F0FAF4] transition-colors"
            style={{ 
              width: 20, 
              height: 20, 
              color: '#8EBFA3', 
              cursor: 'pointer', 
              zIndex: 20 
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}