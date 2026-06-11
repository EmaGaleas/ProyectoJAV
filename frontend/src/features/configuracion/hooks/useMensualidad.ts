import { useState, useEffect, useCallback } from "react";
import * as svc from "../services/mensualidadService";
import type {
  MontoVigenteDto,
  MesFechaDto,
  VigenciaFuturaDto,
  MensualidadHistorialDto,
} from "../services/mensualidadService";

export function useMensualidad() {
  // ── Estado vigente ──────────────────────────────────────────────────────────
  const [montoVigente,   setMontoVigente]   = useState<MontoVigenteDto | null>(null);
  const [fechasMeses,    setFechasMeses]    = useState<MesFechaDto[]>([]);
  // ── Próximas vigencias ──────────────────────────────────────────────────────
  const [proximas,       setProximas]       = useState<VigenciaFuturaDto[]>([]);
  // ── Historial ───────────────────────────────────────────────────────────────
  const [historial,      setHistorial]      = useState<MensualidadHistorialDto[]>([]);
  // ── UI state ────────────────────────────────────────────────────────────────
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);

  // ── Carga inicial ───────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mv, fm, prox, hist] = await Promise.all([
        svc.getMontoActual(),
        svc.getFechasMeses(),
        svc.getProximasVigencias(),
        svc.getHistorial(),
      ]);
      setMontoVigente(mv);
      setFechasMeses(fm);
      setProximas(prox);
      setHistorial(hist);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar datos de mensualidad");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Acciones ────────────────────────────────────────────────────────────────

  const updateFechaInicio = async (mesId: number, fechaInicio: string) => {
    await svc.updateFechaInicio(mesId, fechaInicio);
    setFechasMeses((prev) =>
      prev.map((m) => (m.id === mesId ? { ...m, fechaInicio } : m)),
    );
  };

  const addProximaVigencia = async (data: Omit<VigenciaFuturaDto, "id">) => {
    const nueva = await svc.createProximaVigencia(data);
    setProximas((prev) => [...prev, nueva]);
  };

  const removeProximaVigencia = async (id: number) => {
    await svc.deleteProximaVigencia(id);
    setProximas((prev) => prev.filter((v) => v.id !== id));
  };

  return {
    montoVigente,
    fechasMeses,
    proximas,
    historial,
    loading,
    error,
    updateFechaInicio,
    addProximaVigencia,
    removeProximaVigencia,
    refetch: fetchAll,
  };
}
