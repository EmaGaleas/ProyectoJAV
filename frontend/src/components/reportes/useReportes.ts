import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import type { ReporteTab, TipoBalance, MorosoRecord, BalanceRecord } from './typesReportes';
import { exportMorosos, exportBalance } from './exportReportes';

// Instancia configurada de Axios (puedes adaptarle el baseURL de ser necesario)
const api = axios.create({
  baseURL: 'http://localhost:5209/', // Apunta a tu puerto de desarrollo o proxy de .NET 9
});

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

  // Estados reales provenientes del Backend
  const [morososData, setMorososData] = useState<MorosoRecord[]>([]);
  const [balanceData, setBalanceData] = useState<BalanceRecord[]>([]);
  const [isLoading, setIsLoading]     = useState<boolean>(false);
  const [error, setError]             = useState<string | null>(null);

  // Efecto para sincronizar la UI con la API de .NET 9 de forma limpia
  const cargarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'Morosos') {
        const response = await api.get<MorosoRecord[]>('api/reportes/morosos');
        setMorososData(response.data);
      } else {
        const response = await api.get<BalanceRecord[]>('api/reportes/balance');
        setBalanceData(response.data);
      }
      setPage(1); // Reiniciar paginación al refrescar o cambiar de pestaña
    } catch (err: any) {
      console.error("Error cargando reportes financieros:", err);
      setError(
        err.response?.data?.message || 
        'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  // Filtrado en memoria sobre los datos reales devueltos por la DB
  const filteredMorosos = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const list = q
      ? morososData.filter(r =>
          r.residente.toLowerCase().includes(q) ||
          r.dni.toLowerCase().includes(q) ||
          r.ubicacion.bloque.toLowerCase().includes(q)
        )
      : [...morososData];
    return list.sort((a, b) => a.mesesAtraso - b.mesesAtraso);
  }, [filters.search, morososData]);

  const filteredBalance = useMemo(() => {
    return balanceData.filter(r => {
      const q = filters.search.toLowerCase().trim();
      if (q && !r.descripcion.toLowerCase().includes(q) && !r.categoria.toLowerCase().includes(q)) return false;
      if (filters.dateFrom && r.fecha < filters.dateFrom) return false;
      if (filters.dateTo   && r.fecha > filters.dateTo)   return false;
      if (filters.tipos.length > 0 && !filters.tipos.includes(r.tipo)) return false;
      return true;
    });
  }, [filters, balanceData]);

  const kpisMorosos = useMemo(() => ({
    totalMora: filteredMorosos.reduce((acc, r) => acc + r.montoTotal, 0),
    deudores:  filteredMorosos.length,
  }), [filteredMorosos]);

  const handleTabChange = (tab: ReporteTab) => {
    setActiveTab(tab);
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
    isLoading,
    error,
    setPage,
    setFilters,
    handleTabChange,
    handleExportExcel,
    refrescar: cargarDatos
  };
}