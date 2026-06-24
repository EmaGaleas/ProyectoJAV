// useMultas.ts
import { useState, useMemo, useEffect } from "react";
import type { MultaRecord, MultaStatus, TipoMulta } from "./types";
import { DEFAULT_MULTAS_FILTERS } from "./MultasFilters";
import type { MultasFilterValues } from "./MultasFilters";
import { api } from "../../../services/api";

export function useMultas() {
  const [records, setRecords] = useState<MultaRecord[]>([]);
  const [tiposMulta, setTiposMulta] = useState<TipoMulta[]>([{ idMulta: 0, tipoDescripcion: "Todos" }]);
  const [activeTab, setActiveTab] = useState<MultaStatus>("Pendiente");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MultaRecord | null>(null);
  const [filters, setFilters] = useState<MultasFilterValues>(DEFAULT_MULTAS_FILTERS);
  const [loading, setLoading] = useState(true);

  // Obtener Tipos de Multas (Excluyendo "Mora")
  const fetchTiposMulta = async () => {
    try {
      const response = await api.get("api/TiposCobro/Multas");
      
      // Filtrar el tipo "Mora" comprobando la descripción
      const tiposValidos = response.data
        .filter((t: any) => 
          t.tipoDescripcion?.toLowerCase() !== "mora" && 
          t.descripcion?.toLowerCase() !== "mora"
        )
        .map((t: any) => ({
          idMulta: t.idMulta || t.id,
          tipoDescripcion: t.tipoDescripcion || t.descripcion
        }));

      setTiposMulta([{ idMulta: 0, tipoDescripcion: "Todos" }, ...tiposValidos]);
    } catch (error) {
      console.error("Error obteniendo tipos de multas", error);
    }
  };

  // Obtener Multas del API Real
  const fetchMultas = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/multas");
      setRecords(response.data);
    } catch (error) {
      console.error("Error obteniendo multas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposMulta();
    fetchMultas();
  }, []);

  const counts = useMemo(() => {
    return {
      Pagada: records.filter((r) => r.estado === "Pagada").length,
      Pendiente: records.filter((r) => r.estado === "Pendiente").length,
    };
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (r.estado !== activeTab) return false;

      const q = filters.search.toLowerCase().trim();
      if (q) {
        const match =
          r.idMulta?.toString().toLowerCase().includes(q) ||
          r.nombreUsuario?.toLowerCase().includes(q) ||
          r.dni?.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (r.fecha) {
        if (filters.dateFrom && r.fecha < filters.dateFrom) return false;
        if (filters.dateTo && r.fecha > filters.dateTo) return false;
      }
      if (
        filters.tipo.tipoDescripcion !== "Todos" &&
        r.tipoDescripcion !== filters.tipo.tipoDescripcion
      ) {
        return false;
      }

      return true;
    });
  }, [records, activeTab, filters]);

  const handleTabChange = (status: MultaStatus) => {
    setActiveTab(status);
    setPage(1);
  };

  return {
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
    loading
  };
}
