import { useState } from "react"; // <-- Importamos useState
import { useMultas } from "./useMultas";
import { MultasTabs, MULTAS_TAB_META } from "./MultasTabs";
import { MultasTable } from "./MultasTable";
import { MultasFilters } from "./MultasFilters";
import { MultaDetailModal } from "./MultaDetailModal";
import AsignarMultaForm from "./asignarMultas/AsignarMultaForm";
export default function HistorialMultas() {
  // Estado para controlar si el formulario de Asignar Multa está abierto
  const [isAsignarOpen, setIsAsignarOpen] = useState(false);

  const {
    filtered,
    counts,
    activeTab,
    page,
    selected,
    filters,
    tiposMulta,
    setPage,
    setSelected,
    setFilters,
    handleTabChange,
    fetchMultas,
  } = useMultas();

  return (
    <div className="bg-[#f2f2f2] flex flex-col gap-3 min-h-full" data-name="Historial Multas">
      
      {/* Menú de Pestañas (Submenú de la Tabla) */}
      <MultasTabs
        tabs={MULTAS_TAB_META}
        active={activeTab}
        counts={counts}
        onSelect={handleTabChange}
      />

      {/* Contenedor Tabla + Filtros */}
      <div className="flex gap-4 items-start">
        
        <div className="flex-1 min-w-0">
          <MultasTable
            records={filtered}
            page={page}
            onPage={setPage}
            onDetails={setSelected}
          />
        </div>
        
        {/* Contenedor único que agrupa el botón + los filtros */}
        <div className="w-[280px] shrink-0 sticky top-4">
        
        {/* Botón Asignar Multa - Ahora cambia el estado a true */}
        <button
            onClick={() => setIsAsignarOpen(true)}
            className="w-full px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm mb-3 cursor-pointer"
            style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Asignar Multa
        </button>

        {/* Filtros - Justo debajo del botón, con el mismo ancho heredado */}
        <MultasFilters
            filters={filters}
            onChange={setFilters}
            tiposMulta={tiposMulta}
        />
        </div>
        
      </div>

      {/* Modales */}
      {selected && (
        <MultaDetailModal
          record={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Renderizamos tu formulario aquí, pasándole onClose para que pueda cerrarse */}
      {isAsignarOpen && (
        <AsignarMultaForm onClose={() => setIsAsignarOpen(false)} tiposMulta={tiposMulta} onSuccess={fetchMultas} />
      )}
    </div>
  );
}