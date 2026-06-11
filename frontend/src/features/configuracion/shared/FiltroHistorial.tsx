import { Search, X } from "lucide-react";
import { INPUT_CLS, SELECT_CLS } from "../types";

export interface FiltroHistorialState {
  busqueda: string;
  fechaDesde: string;
  fechaHasta: string;
  editadoPor: string;
}

export const FILTRO_VACIO: FiltroHistorialState = {
  busqueda: "",
  fechaDesde: "",
  fechaHasta: "",
  editadoPor: "",
};

interface Props {
  filtros: FiltroHistorialState;
  onChange: (f: FiltroHistorialState) => void;
  onLimpiar: () => void;
  editadoresList?: string[];
  placeholder?: string;
}

export function FiltroHistorial({ filtros, onChange, onLimpiar, editadoresList = [], placeholder = "Buscar..." }: Props) {
  const set = (k: keyof FiltroHistorialState, v: string) =>
    onChange({ ...filtros, [k]: v });

  const hayFiltros =
    filtros.busqueda || filtros.fechaDesde || filtros.fechaHasta || filtros.editadoPor;

  return (
    <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-4 flex flex-wrap gap-3 items-end">
      {/* Búsqueda */}
      <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
        <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Buscar</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#abafb1] pointer-events-none" />
          <input
            type="text"
            value={filtros.busqueda}
            onChange={(e) => set("busqueda", e.target.value)}
            placeholder={placeholder}
            className={`${INPUT_CLS} pl-9`}
          />
        </div>
      </div>

      {/* Fecha desde */}
      <div className="flex flex-col gap-1 min-w-[150px]">
        <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Desde</label>
        <input
          type="date"
          value={filtros.fechaDesde}
          onChange={(e) => set("fechaDesde", e.target.value)}
          className={INPUT_CLS}
        />
      </div>

      {/* Fecha hasta */}
      <div className="flex flex-col gap-1 min-w-[150px]">
        <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Hasta</label>
        <input
          type="date"
          value={filtros.fechaHasta}
          onChange={(e) => set("fechaHasta", e.target.value)}
          className={INPUT_CLS}
        />
      </div>

      {/* Editado por */}
      {editadoresList.length > 0 && (
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Editado por</label>
          <div className="relative">
            <select
              value={filtros.editadoPor}
              onChange={(e) => set("editadoPor", e.target.value)}
              className={SELECT_CLS}
            >
              <option value="">Todos</option>
              {editadoresList.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Limpiar */}
      {hayFiltros && (
        <button
          type="button"
          onClick={onLimpiar}
          className="h-[45.6px] px-4 rounded-[10px] border border-[#d1d5dc] text-[#6b7280] font-['Arimo',sans-serif] text-[14px] hover:bg-[#f9fafb] transition-colors cursor-pointer flex items-center gap-2"
        >
          <X size={15} />
          Limpiar
        </button>
      )}
    </div>
  );
}
