import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import type { MoraHistorial } from "./types";
import { MORA_ACTUAL, MORA_HISTORIAL, TH_CLS, TD_CLS, fmtDate, fmtMonto } from "./types";
import { FiltroHistorial, FILTRO_VACIO } from "./shared/FiltroHistorial";
import type { FiltroHistorialState } from "./shared/FiltroHistorial";
import { Paginacion, PAGE_SIZE } from "./shared/Paginacion";
import { ProximasVigencias } from "./shared/ProximasVigencias";
import type { VigenciaFutura } from "./shared/ProximasVigencias";

// ─── Estado Actual (solo lectura) ─────────────────────────────────────────────

function EstadoActualMora({ monto, fechaInicio }: { monto: number; fechaInicio: string }) {
  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
        <p className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] mb-1">Monto actual de mora</p>
        <p className="font-['Montserrat',sans-serif] text-[32px] font-semibold text-[#308c58] mb-3">{fmtMonto(monto)}</p>
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-[#6b7280]" />
          <span className="font-['Arimo',sans-serif] text-[14px] text-[#6b7280]">
            {fmtDate(fechaInicio)} — Presente
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Historial ────────────────────────────────────────────────────────────────

function HistorialMora({ historial }: { historial: MoraHistorial[] }) {
  const [filtros, setFiltros] = useState<FiltroHistorialState>(FILTRO_VACIO);
  const [page, setPage] = useState(0);
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
              {pagina.length === 0
                ? <tr><td colSpan={4} className="text-center py-10 text-[#6b7280] font-['Arimo',sans-serif] text-[14px]">Sin registros</td></tr>
                : pagina.map((h) => (
                  <tr key={h.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className={`${TD_CLS} font-medium text-[#308c58]`}>{fmtMonto(h.monto)}</td>
                    <td className={TD_CLS}>{fmtDate(h.fechaInicio)}</td>
                    <td className={TD_CLS}>{fmtDate(h.fechaFin)}</td>
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
  const [monto] = useState(MORA_ACTUAL.monto);
  const [fechaInicio] = useState(MORA_ACTUAL.fechaInicio);
  const [historial] = useState<MoraHistorial[]>(MORA_HISTORIAL);
  const [vigencias, setVigencias] = useState<VigenciaFutura[]>([]);

  return (
    <>
      {subTab === "estado"    && <EstadoActualMora monto={monto} fechaInicio={fechaInicio} />}
      {subTab === "proximas"  && (
        <ProximasVigencias
          etiqueta="Mora"
          montoActual={monto}
          vigencias={vigencias}
          onAdd={(v) => setVigencias((p) => [...p, { id: Date.now(), ...v }])}
          onRemove={(id) => setVigencias((p) => p.filter((x) => x.id !== id))}
        />
      )}
      {subTab === "historial" && <HistorialMora historial={historial} />}
    </>
  );
}
