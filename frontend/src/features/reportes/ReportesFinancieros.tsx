import { Download } from 'lucide-react';
import { useReportes } from '../../components/reportes/useReportes';
import { ReportesTabs } from '../../components/reportes/ReportesTabs';
import { ReportesFilters } from '../../components/reportes/ReportesFilters';
import { MorososTable } from '../../components/reportes/MorososTable';
import { BalanceTable } from '../../components/reportes/BalanceTable';
import { fmtLps } from '../../components/reportes/utilsReportes';

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
    handleExportExcel,
  } = useReportes();

  return (
    <div className="bg-[#f2f2f2] flex flex-col gap-3 min-h-full" data-name="Reportes Financieros">

      <ReportesTabs active={activeTab} onSelect={handleTabChange} />

      <div className="flex gap-4 items-start">

        {/* Izquierda: Tabla + KPIs */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {activeTab === 'Morosos' && (
            <div className="animate-fade-in">
              <MorososTable records={filteredMorosos} page={page} onPage={setPage} />
            </div>
          )}

          {activeTab === 'Balance' && (
            <div className="animate-fade-in">
              <BalanceTable records={filteredBalance} page={page} onPage={setPage} />
            </div>
          )}
        </div>

        {/* Derecha: Exportar + Filtros sticky */}
        <div className="w-[280px] shrink-0 sticky top-4">
          <button
            onClick={handleExportExcel}
            className="w-full px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm mb-3 cursor-pointer"
            style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
          >
            <Download size={18} />
            Exportar {activeTab === 'Morosos' ? 'Morosidad' : 'Balance'}
          </button>

            {activeTab === 'Morosos' && (
            <div className="flex flex-col gap-3 mt-3 pb-3">
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-sm p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[#E2A540] uppercase tracking-wider">
                  Cantidad Deudores Identificados
                </span>
                <span className="text-[22px] font-bold text-[#1A1A1A]">
                  {kpisMorosos.deudores} <span className="text-[14px] font-medium text-[#9fa3a5]">usuarios</span>
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-sm p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[#c0392b] uppercase tracking-wider">
                  Total en Mora Estimado
                </span>
                <span className="text-[22px] font-bold text-[#c0392b]">
                  {fmtLps(kpisMorosos.totalMora)}
                </span>
              </div>
            </div>
          )}

          <ReportesFilters filters={filters} onChange={setFilters} activeTab={activeTab} />

        
        </div>

      </div>
    </div>
  );
}