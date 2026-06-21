import { Download } from 'lucide-react';
import { useReportes } from '../../components/reportes/useReportes';
import { ReportesTabs } from '../../components/reportes/ReportesTabs';
import { ReportesFilters } from '../../components/reportes/ReportesFilters'; // (Asumiendo que creaste tu versión de MultasFilters)
import { MorososTable } from '../../components/reportes/MorososTable';
import { BalanceTable } from '../../components/reportes/BalanceTable'; 

export default function ReportesFinancieros() {
  const {
    activeTab,
    page,
    filters,
    filteredMorosos,
    filteredBalance,
    kpisMorosos,
    setPage,
    setFilters,
    handleTabChange,
    handleExportExcel
  } = useReportes();

  return (
    <div className="bg-[#f2f2f2] flex flex-col gap-3 min-h-full" data-name="Reportes Financieros">
      
      {/* Menú de Pestañas */}
      <ReportesTabs
        active={activeTab}
        onSelect={handleTabChange}
      />

      {/* Contenedor Principal: Tabla + Filtros Sticky */}
      <div className="flex gap-4 items-start">
        
        {/* Lado Izquierdo: Tablas y KPIs */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          
          {/* Micro-KPIs exclusivos de Morosidad */}
          {activeTab === 'Morosos' && (
            <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-sm flex items-center justify-end gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-[#E2A540] uppercase tracking-wider">Deudores Identificados</span>
                <span className="text-[18px] font-bold text-[#1A1A1A]">{kpisMorosos.deudores} usuarios</span>
              </div>
              <div className="w-[1px] h-8 bg-[#e5e7eb]"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-[#c0392b] uppercase tracking-wider">Total en Mora Estimado</span>
                <span className="text-[18px] font-bold text-[#c0392b]">
                  L. {kpisMorosos.totalMora.toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
          
          {activeTab === 'Morosos' && (
            <div className="animate-fade-in">
              <MorososTable 
                records={filteredMorosos} 
                page={page} 
                onPage={setPage} 
              />
            </div>
          )}

          {activeTab === 'Balance' && (
            <div className="animate-fade-in">
              <BalanceTable 
                records={filteredBalance} 
                page={page} 
                onPage={setPage} 
              />
            </div>
          )}
        </div>
        
        {/* Lado Derecho: Contenedor Sticky para Botón Excel + Filtros */}
        <div className="w-[280px] shrink-0 sticky top-4">
          
          {/* Botón Exportar a Excel - Reemplaza al de "Asignar Multa" */}
          <button
            onClick={handleExportExcel}
            className="w-full px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm mb-3 cursor-pointer"
            style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
          >
            <Download size={18} />
            Exportar {activeTab}
          </button>

          {/* Componente de Filtros adaptado */}
          <ReportesFilters
            filters={filters}
            onChange={setFilters}
          />
        </div>
        
      </div>
    </div>
  );
}