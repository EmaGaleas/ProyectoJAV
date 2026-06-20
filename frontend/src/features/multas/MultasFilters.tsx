import React, { useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import type { MultaType } from './types';
import { fmtDate } from './types'; // Importamos tu formateador de fechas
import { SearchableSelect } from './SearchableSelect'; // Asegúrate de que la ruta sea correcta

export interface MultasFilterValues {
  search: string;
  dateFrom: string;
  dateTo: string;
  tipo: MultaType;
}

export const DEFAULT_MULTAS_FILTERS: MultasFilterValues = { 
  search: '', 
  dateFrom: '', 
  dateTo: '', 
  tipo: 'Todos' 
};

interface Props {
  filters: MultasFilterValues;
  onChange: (f: MultasFilterValues) => void;
}

// Opciones para el SearchableSelect
const opcionesTipoFiltro = [
  { label: "Todos", value: "Todos" },
  { label: "Tránsito", value: "Tránsito" },
  { label: "Estacionamiento", value: "Estacionamiento" },
  { label: "Exceso de velocidad", value: "Exceso de velocidad" },
  { label: "Documentación", value: "Documentación" },
];

export function MultasFilters({ filters, onChange }: Props) {
  const set = (key: keyof MultasFilterValues, value: string) =>
    onChange({ ...filters, [key]: value });

  const hasAny = filters.search || filters.dateFrom || filters.dateTo || filters.tipo !== 'Todos';
  const handleClear = () => onChange(DEFAULT_MULTAS_FILTERS);

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] p-5 flex flex-col h-full"
      style={{ minWidth: 260 }}
    >
      {/* Header del Filtro */}
      <div className="flex items-center justify-between mb-5">
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>Filtros</span>
        {hasAny && (
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-[#c0392b] hover:underline transition-all cursor-pointer"
          >
            Quitar Filtros
          </button>
        )}
      </div>

      {/* Búsqueda */}
      <FilterGroup label="Buscar">
        <textarea
          placeholder="Búsqueda por código, persona multada, DNI..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          className="w-full h-20 px-3 py-2 text-sm rounded-xl border border-[rgba(0,0,0,0.12)] bg-white focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30 resize-none"
          style={{ 
            color: filters.search ? '#1A1A1A' : undefined,
            lineHeight: '1.25rem' 
          }}
        />
      </FilterGroup>

      {/* Tipo de multa */}
      <FilterGroup label="Tipo de multa">
        <SearchableSelect
          options={opcionesTipoFiltro}
          value={filters.tipo}
          onChange={(opt) => set('tipo', opt.value as MultaType)}
          placeholder="Seleccionar tipo..."
        />
      </FilterGroup>

      {/* Fechas */}
      <FilterGroup label="Rango de fecha">
        <DateInput label="Desde" value={filters.dateFrom} onChange={v => set('dateFrom', v)} />
        <DateInput label="Hasta" value={filters.dateTo} onChange={v => set('dateTo', v)} />
      </FilterGroup>
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

// Actualizado con tu caso de éxito
function DateInput({ label, value, onChange, max }: { label: string; value: string; onChange: (v: string) => void; max?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    if (inputRef.current) {
      try {
        inputRef.current.showPicker();
      } catch (err) {
        // Fallback silencioso si el navegador no soporta showPicker
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full mb-2">
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </span>
      
      {/* Contenedor principal */}
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
  );
}