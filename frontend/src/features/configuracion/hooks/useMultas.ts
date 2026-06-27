import { useState, useEffect, useCallback } from "react";
import * as svc from "../services/multasService";
import type {
  MultaTipoDto,
  MultaHistorialDto,
  ProximaMultaDto,
} from "../services/multasService";

export function useMultas() {
  // ── Estado vigente ──────────────────────────────────────────────────────────
  const [vigentes,  setVigentes]  = useState<MultaTipoDto[]>([]);
  // ── Próximas vigencias ──────────────────────────────────────────────────────
  const [proximas,  setProximas]  = useState<ProximaMultaDto[]>([]);
  // ── Historial ───────────────────────────────────────────────────────────────
  const [historial, setHistorial] = useState<MultaHistorialDto[]>([]);
  // ── UI state ────────────────────────────────────────────────────────────────
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vig, prox, hist] = await Promise.all([
        svc.getMultasVigentes(),
        svc.getProximasVigencias(),
        svc.getHistorial(),
      ]);
      setVigentes(vig);
      setProximas(prox);
      setHistorial(hist);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar datos de multas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Acciones ────────────────────────────────────────────────────────────────

  const addMulta = async (data: Omit<MultaTipoDto, "id">) => {
    const nueva = await svc.createMulta(data);
    setVigentes((prev) => [...prev, nueva]);
  };

  const updateMulta = async (id: number, tipoNuevo: string) => {
    await svc.updateMulta(id, tipoNuevo);
    // 2. Se actualiza el estado local copiando el objeto e inyectando el nuevo tipo
    setVigentes((prev) => prev.map((m) => (m.id === id ? { ...m, tipo: tipoNuevo } : m)));
    // Se recarga el historial para que los nombres agrupados se actualicen visualmente
    const hist = await svc.getHistorial();
    setHistorial(hist);
  };


  const addProximaVigencia = async (data: Omit<ProximaMultaDto, "id">) => {
    const nueva = await svc.createProximaVigencia(data);
    setProximas((prev) => [...prev, nueva]);
  };

  const removeProximaVigencia = async (id: number) => {
    await svc.deleteProximaVigencia(id);
    setProximas((prev) => prev.filter((v) => v.id !== id));
  };

  return {
    vigentes,
    proximas,
    historial,
    loading,
    error,
    addMulta,
    updateMulta,
    addProximaVigencia,
    removeProximaVigencia,
    refetch: fetchAll,
  };
}
