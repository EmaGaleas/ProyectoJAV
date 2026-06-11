import { useState, useEffect, useCallback } from "react";
import * as svc from "../services/conexionService";
import type {
  ConexionActualDto,
  ConexionHistorialDto,
  ProximaConexionDto,
} from "../services/conexionService";

export function useConexion() {
  // ── Estado vigente ──────────────────────────────────────────────────────────
  const [actual,    setActual]    = useState<ConexionActualDto | null>(null);
  // ── Próximas vigencias ──────────────────────────────────────────────────────
  const [proximas,  setProximas]  = useState<ProximaConexionDto[]>([]);
  // ── Historial ───────────────────────────────────────────────────────────────
  const [historial, setHistorial] = useState<ConexionHistorialDto[]>([]);
  // ── UI state ────────────────────────────────────────────────────────────────
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [act, prox, hist] = await Promise.all([
        svc.getConexionActual(),
        svc.getProximasVigencias(),
        svc.getHistorial(),
      ]);
      setActual(act);
      setProximas(prox);
      setHistorial(hist);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar datos de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Acciones ────────────────────────────────────────────────────────────────

  const addProximaVigencia = async (data: Omit<ProximaConexionDto, "id">) => {
    const nueva = await svc.createProximaVigencia(data);
    setProximas((prev) => [...prev, nueva]);
  };

  const removeProximaVigencia = async (id: number) => {
    await svc.deleteProximaVigencia(id);
    setProximas((prev) => prev.filter((v) => v.id !== id));
  };

  return {
    actual,
    proximas,
    historial,
    loading,
    error,
    addProximaVigencia,
    removeProximaVigencia,
    refetch: fetchAll,
  };
}
