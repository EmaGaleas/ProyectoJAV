import { useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import type { ReportesFilterValues } from './useReportes';
import { DEFAULT_REPORTES_FILTERS } from './useReportes';
import type { ReporteTab, TipoBalance } from './typesReportes';
import { fmtDate } from './utilsReportes';

interface Props {
  filters:   ReportesFilterValues;
  onChange:  (f: ReportesFilterValues) => void;
  activeTab: ReporteTab;
}

export function ReportesFilters({ filters, onChange, activeTab }: Props) {
  const set = (key: keyof ReportesFilterValues, value: ReportesFilterValues[typeof key]) =>
    onChange({ ...filters, [key]: value });

  const toggleTipo = (tipo: TipoBalance) => {
    const next = filters.tipos.includes(tipo)
      ? filters.tipos.filter(t => t !== tipo)
      : [...filters.tipos, tipo];
    set('tipos', next);
  };

  const hasAny = filters.search || filters.dateFrom || filters.dateTo || filters.tipos.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] p-5 flex flex-col" style={{ minWidth: 260 }}>

      <div className="flex items-center justify-between mb-5">
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Filtros</span>
        {hasAny && (
          <button onClick={() => onChange(DEFAULT_REPORTES_FILTERS)} className="text-xs font-semibold text-[#c0392b] hover:underline transition-all cursor-pointer">
            Quitar Filtros
          </button>
        )}
      </div>

      <FilterGroup label="Buscar">
        <textarea
          placeholder={activeTab === 'Morosos' ? 'Residente, bloque, DNI...' : 'Categoría, descripción...'}
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          className="w-full h-20 px-3 py-2 text-sm rounded-xl border border-[rgba(0,0,0,0.12)] bg-white focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30 resize-none"
          style={{ color: filters.search ? '#1A1A1A' : undefined, lineHeight: '1.25rem' }}
        />
      </FilterGroup>

      {activeTab === 'Balance' && (
        <>
          <FilterGroup label="Rango de fecha">
            <DateInput label="Desde" value={filters.dateFrom} onChange={v => set('dateFrom', v)} />
            <DateInput label="Hasta" value={filters.dateTo}   onChange={v => set('dateTo',   v)} />
          </FilterGroup>

          <FilterGroup label="Tipo de movimiento">
            {(['Ingreso', 'Egreso'] as TipoBalance[]).map(tipo => {
              const checked = filters.tipos.includes(tipo);
              const color   = tipo === 'Ingreso' ? '#308C58' : '#c0392b';
              return (
                <label key={tipo} className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => toggleTipo(tipo)}>
                  <span
                    className="flex items-center justify-center rounded-full border-2 transition-all"
                    style={{
                      width: 18, height: 18,
                      borderColor:  checked ? color : 'rgba(0,0,0,0.18)',
                      background:   checked ? color : '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {checked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? color : '#514f4f' }}>
                    {tipo}
                  </span>
                </label>
              );
            })}
          </FilterGroup>
        </>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{label}</span>
      {children}
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = () => { try { inputRef.current?.showPicker(); } catch { /* unsupported */ } };

  return (
    <div className="flex flex-col gap-1 w-full mb-2">
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div
        onClick={openPicker}
        className="relative w-full h-9 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white hover:border-[#308C58] transition-colors overflow-hidden flex items-center cursor-pointer"
      >
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          onClick={openPicker}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }}
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
            onClick={e => { e.preventDefault(); e.stopPropagation(); onChange(''); }}
            className="absolute right-2 flex items-center justify-center rounded-full hover:bg-[#F0FAF4] transition-colors"
            style={{ width: 20, height: 20, color: '#8EBFA3', cursor: 'pointer', zIndex: 20 }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}