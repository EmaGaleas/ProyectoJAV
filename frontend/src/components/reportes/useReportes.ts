import { useState, useMemo } from 'react';
import type { ReporteTab, TipoBalance } from './typesReportes';
import { MOCK_MOROSOS, MOCK_BALANCE } from './mockReportes';
import { exportMorosos, exportBalance } from './exportReportes';

export interface ReportesFilterValues {
  search:   string;
  dateFrom: string;
  dateTo:   string;
  tipos:    TipoBalance[];
}

export const DEFAULT_REPORTES_FILTERS: ReportesFilterValues = {
  search:   '',
  dateFrom: '',
  dateTo:   '',
  tipos:    [],
};

export function useReportes() {
  const [activeTab, setActiveTab] = useState<ReporteTab>('Morosos');
  const [page, setPage]           = useState(1);
  const [filters, setFilters]     = useState<ReportesFilterValues>(DEFAULT_REPORTES_FILTERS);

  const filteredMorosos = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const list = q
      ? MOCK_MOROSOS.filter(r =>
          r.residente.toLowerCase().includes(q) ||
          r.dni.toLowerCase().includes(q) ||
          r.ubicacion.bloque.toLowerCase().includes(q)
        )
      : [...MOCK_MOROSOS];
    return list.sort((a, b) => a.mesesAtraso - b.mesesAtraso);
  }, [filters.search]);

  const filteredBalance = useMemo(() => {
    return MOCK_BALANCE.filter(r => {
      const q = filters.search.toLowerCase().trim();
      if (q && !r.descripcion.toLowerCase().includes(q) && !r.categoria.toLowerCase().includes(q)) return false;
      if (filters.dateFrom && r.fecha < filters.dateFrom) return false;
      if (filters.dateTo   && r.fecha > filters.dateTo)   return false;
      if (filters.tipos.length > 0 && !filters.tipos.includes(r.tipo)) return false;
      return true;
    });
  }, [filters]);

  const kpisMorosos = useMemo(() => ({
    totalMora: filteredMorosos.reduce((acc, r) => acc + r.montoTotal, 0),
    deudores:  filteredMorosos.length,
  }), [filteredMorosos]);

  const handleTabChange = (tab: ReporteTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleExportExcel = () => {
    if (activeTab === 'Morosos') {
      exportMorosos(filteredMorosos);
    } else {
      exportBalance(filteredBalance);
    }
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
    handleExportExcel,
  };
}