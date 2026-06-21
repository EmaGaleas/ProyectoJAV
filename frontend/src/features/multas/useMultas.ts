import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import type { MultaRecord, MultaStatus } from './types';
import { MOCK_MULTAS } from './data/mockData';
import { DEFAULT_MULTAS_FILTERS } from './MultasFilters';
import type { MultasFilterValues } from './MultasFilters';

export function useMultas() {
  const [records] = useState<MultaRecord[]>(MOCK_MULTAS);
  const [activeTab, setActiveTab] = useState<MultaStatus>('Pendiente');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MultaRecord | null>(null);
  
  // Ahora usamos un solo estado para los filtros (Auto-apply)
  const [filters, setFilters] = useState<MultasFilterValues>(DEFAULT_MULTAS_FILTERS);

  // Contadores para las pestañas
  const counts = useMemo(() => {
    return {
      Aprobado: records.filter(r => r.status === 'Aprobado').length,
      Pendiente: records.filter(r => r.status === 'Pendiente').length,
    };
  }, [records]);

  // Filtrado reactivo en tiempo real
  const filtered = useMemo(() => {
    return records.filter(r => {
      // 1. Filtrar primero por el Tab activo
      if (r.status !== activeTab) return false;

      // 2. Filtros del panel lateral
      const q = filters.search.toLowerCase().trim();
      if (q) {
        const match = 
          r.codigoMulta.toLowerCase().includes(q) ||
          r.personaMultada.toLowerCase().includes(q) ||
          r.dni.toLowerCase().includes(q);
        if (!match) return false;
      }
      
      if (filters.dateFrom && r.fecha < filters.dateFrom) return false;
      if (filters.dateTo && r.fecha > filters.dateTo) return false;
      if (filters.tipo !== 'Todos' && r.tipoMulta !== filters.tipo) return false;

      return true;
    });
  }, [records, activeTab, filters]);

  const handleTabChange = (status: MultaStatus) => {
    setActiveTab(status);
    setPage(1);
  };

  const handleAsignarPlaceholder = () => {
    toast.info('La funcionalidad de "Asignar Multa" estará disponible próximamente.');
  };

  return {
    filtered,
    counts,
    activeTab,
    page,
    selected,
    filters,
    setPage,
    setSelected,
    setFilters,
    handleTabChange,
    handleAsignarPlaceholder
  };
}