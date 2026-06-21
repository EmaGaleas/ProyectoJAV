import { useState, useMemo } from 'react';
import type { ReporteTab } from './typesReportes';
import { MOCK_MOROSOS, MOCK_BALANCE } from './mockReportes';

export interface ReportesFilterValues {
  search: string;
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_REPORTES_FILTERS: ReportesFilterValues = {
  search: '',
  dateFrom: '',
  dateTo: '',
};

export function useReportes() {
  const [activeTab, setActiveTab] = useState<ReporteTab>('Morosos');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ReportesFilterValues>(DEFAULT_REPORTES_FILTERS);

  // 1. Lógica de Filtrado para Morosos
  const filteredMorosos = useMemo(() => {
    return MOCK_MOROSOS.filter(r => {
      const q = filters.search.toLowerCase().trim();
      if (q) {
        const match = 
          r.residente.toLowerCase().includes(q) ||
          r.dni.toLowerCase().includes(q) ||
          r.ubicacion.bloque.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true; // Morosos usualmente no se filtran por fecha de transacción
    });
  }, [filters.search]);

  // 2. Lógica de Filtrado para Balance General
  const filteredBalance = useMemo(() => {
    return MOCK_BALANCE.filter(r => {
      const q = filters.search.toLowerCase().trim();
      if (q && !r.descripcion.toLowerCase().includes(q) && !r.categoria.toLowerCase().includes(q)) return false;
      if (filters.dateFrom && r.fecha < filters.dateFrom) return false;
      if (filters.dateTo && r.fecha > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  // 3. Cálculo de KPIs para la pestaña de Morosos
  const kpisMorosos = useMemo(() => {
    return {
      totalMora: filteredMorosos.reduce((acc, curr) => acc + curr.montoTotal, 0),
      deudores: filteredMorosos.length
    };
  }, [filteredMorosos]);

  const handleTabChange = (tab: ReporteTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  // 4. Lógica de Exportación (Simulada para el MVP)
  const handleExportExcel = () => {
    const fileName = `Reporte_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`;
    // Aquí en el futuro conectarías con la librería "xlsx"
    alert(`Generando archivo Excel: ${fileName}\n(Esta funcionalidad requerirá la librería xlsx en el backend o frontend)`);
  };

  return {
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
  };
}