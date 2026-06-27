import { useState, useMemo, useEffect } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { TH_CLS, TD_CLS, fmtDate, fmtMonto } from "./types";
import { FiltroHistorial, FILTRO_VACIO } from "./shared/FiltroHistorial";
import type { FiltroHistorialState } from "./shared/FiltroHistorial";
import { Paginacion, PAGE_SIZE } from "./shared/Paginacion";
import { ProximasVigencias } from "./shared/ProximasVigencias";
import type { VigenciaFutura } from "./shared/ProximasVigencias";

import * as moraService from "./services/moraService";
import type { MoraHistorialDto } from "./services/moraService";

// ─── Estado Actual (solo lectura) ─────────────────────────────────────────────

function EstadoActualMora({ monto, fechaInicio, loading }: { monto: number; fechaInicio: string; loading: boolean }) {
  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
        <p className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] mb-1">Monto actual de mora</p>
        {loading ? (
          <div className="py-2"><Loader2 className="animate-spin text-[#308c58]" size={24} /></div>
        ) : (
          <>
            <p className="font-['Montserrat',sans-serif] text-[32px] font-semibold text-[#308c58] mb-3">{fmtMonto(monto)}</p>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#6b7280]" />
              <span className="font-['Arimo',sans-serif] text-[14px] text-[#6b7280]">
                {fechaInicio ? `${fmtDate(fechaInicio)} — Presente` : "No hay monto de mora registrado"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Historial ────────────────────────────────────────────────────────────────

function HistorialMora() {
  const [historial, setHistorial] = useState<MoraHistorialDto[]>([]);
  const [filtros, setFiltros] = useState<FiltroHistorialState>(FILTRO_VACIO);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const data = await moraService.getHistorial();
      setHistorial(data);
    } catch (error) {
      console.error("Error obteniendo historial de mora", error);
    } finally {
      setLoading(false);
    }
  };

  const editores = [...new Set(historial.map((h) => h.editadoPor))];
  const filtrado = useMemo(() =>
    historial.filter((h) => {
      const q = filtros.busqueda.toLowerCase();
      const matchBusqueda = !filtros.busqueda || h.editadoPor.toLowerCase().includes(q) || String(h.monto).includes(filtros.busqueda);
      const matchDesde = !filtros.fechaDesde || h.fechaInicio >= filtros.fechaDesde;
      const matchHasta = !filtros.fechaHasta || h.fechaFin <= filtros.fechaHasta;
      const matchEditor = !filtros.editadoPor || h.editadoPor === filtros.editadoPor;
      return matchBusqueda && matchDesde && matchHasta && matchEditor;
    }), [filtros, historial]);
  const pagina = filtrado.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const handleFiltros = (f: FiltroHistorialState) => { setFiltros(f); setPage(0); };

  return (
    <div className="flex flex-col gap-5">
      <FiltroHistorial filtros={filtros} onChange={handleFiltros} onLimpiar={() => { setFiltros(FILTRO_VACIO); setPage(0); }} editadoresList={editores} placeholder="Buscar por monto o editor..." />
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb]"><h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">Historial de Tasas de Mora</h4></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#f9fafb]"><th className={TH_CLS}>Monto</th><th className={TH_CLS}>Fecha inicio</th><th className={TH_CLS}>Fecha fin</th><th className={TH_CLS}>Editado por</th></tr></thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-[#308c58]" size={24} />
                  </td>
                </tr>
              ) : pagina.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-[#6b7280] font-['Arimo',sans-serif] text-[14px]">Sin registros</td></tr>
              ) : pagina.map((h) => (
                  <tr key={h.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className={`${TD_CLS} font-medium text-[#308c58]`}>{fmtMonto(h.monto)}</td>
                    <td className={TD_CLS}>{fmtDate(h.fechaInicio)}</td>
                    <td className={TD_CLS}>{h.fechaFin ? fmtDate(h.fechaFin) : "—"}</td>
                    <td className={TD_CLS}>{h.editadoPor}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Paginacion total={filtrado.length} page={page} onChange={setPage} />
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

interface Props { subTab: "estado" | "proximas" | "historial" }

export function SeccionMora({ subTab }: Props) {
  const [monto, setMonto] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [loadingActual, setLoadingActual] = useState(true);
  const [vigencias, setVigencias] = useState<VigenciaFutura[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const actual = await moraService.getMoraActual();
      setMonto(actual.monto);
      setFechaInicio(actual.fechaInicio);

      const proximas = await moraService.getProximasVigencias();
      setVigencias(proximas);
    } catch (error) {
      console.error("Error al cargar datos de mora", error);
    } finally {
      setLoadingActual(false);
    }
  };

  const handleAddProxima = async (v: Omit<VigenciaFutura, "id">) => {
    try {
      const hoy = new Date().toISOString().split("T")[0];
      const esFutura = v.fechaInicio > hoy;

      const nueva = await moraService.createProximaVigencia(v);

      if (esFutura) {
        setVigencias((p) => [...p, nueva]);
      } else {
        await cargarDatos(); 
      }
    } catch (error) {
      console.error("Error al crear próxima vigencia de mora", error);
    }
  };
  const handleRemoveProxima = async (id: number) => {
    try {
      await moraService.deleteProximaVigencia(id);
      setVigencias((p) => p.filter((x) => x.id !== id));
    } catch (error) {
      console.error("Error eliminando vigencia de mora", error);
    }
  };

  return (
    <>
      {subTab === "estado"    && <EstadoActualMora monto={monto} fechaInicio={fechaInicio} loading={loadingActual} />}
      {subTab === "proximas"  && (
        <ProximasVigencias
          etiqueta="Mora"
          montoActual={monto}
          vigencias={vigencias}
          onAdd={handleAddProxima}
          onRemove={handleRemoveProxima}
        />
      )}
      {subTab === "historial" && <HistorialMora />}
    </>
  );
}