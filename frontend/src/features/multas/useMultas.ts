import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import type { MultaRecord, MultaStatus } from "./types";
import { getMultas, MOCK_MULTAS } from "./data/mockData";
import { DEFAULT_MULTAS_FILTERS } from "./MultasFilters";
import type { MultasFilterValues } from "./MultasFilters";

export function useMultas() {
  const [records, setRecords] = useState<MultaRecord[]>(MOCK_MULTAS);
  const [activeTab, setActiveTab] = useState<MultaStatus>("Pendiente");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MultaRecord | null>(null);

  // Ahora usamos un solo estado para los filtros (Auto-apply)
  const [filters, setFilters] = useState<MultasFilterValues>(
    DEFAULT_MULTAS_FILTERS,
  );

  const [loading, setLoading] = useState(true);
  console.log(loading);

  useEffect(() => {
    const fetchMultas = async () => {
      try {
        const data = await getMultas();
        setRecords(data);
        console.log(data);
      } catch (error) {
        console.error("Error obteniendo multas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMultas();
  }, []);

  // Contadores para las pestañas
  const counts = useMemo(() => {
    return {
      Aprobado: records.filter((r) => r.estado === "Aprobado").length,
      Pendiente: records.filter((r) => r.estado === "Pendiente").length,
      Vencido: records.filter((r) => r.estado === "Vencido").length,
    };
  }, [records]);

  // Filtrado reactivo en tiempo real
  const filtered = useMemo(() => {
    return records.filter((r) => {
      // 1. Filtrar primero por el Tab activo
      if (r.estado !== activeTab) return false;

      // 2. Filtros del panel lateral
      const q = filters.search.toLowerCase().trim();
      if (q) {
        const match =
          r.codigoMulta.toLowerCase().includes(q) ||
          r.nombreUsuario.toLowerCase().includes(q) ||
          r.dni.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (r.fecha) {
        if (filters.dateFrom && r.fecha < filters.dateFrom) return false;
        if (filters.dateTo && r.fecha > filters.dateTo) return false;
      }
      if (filters.tipo !== "Todos" && r.tipoDescripcion !== filters.tipo)
        return false;

      return true;
    });
  }, [records, activeTab, filters]);

  const handleTabChange = (status: MultaStatus) => {
    setActiveTab(status);
    setPage(1);
  };

  const handleAsignarPlaceholder = () => {
    toast.info(
      'La funcionalidad de "Asignar Multa" estará disponible próximamente.',
    );
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
    handleAsignarPlaceholder,
  };
}
