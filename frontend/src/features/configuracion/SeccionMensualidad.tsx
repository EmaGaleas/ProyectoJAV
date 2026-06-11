import { useState, useMemo } from "react";
import { Pencil, Check, X, Calendar } from "lucide-react";
import { MENSUALIDAD_HISTORIAL, TH_CLS, TD_CLS, INPUT_CLS, fmtDate, fmtMonto } from "./types";
import { FiltroHistorial, FILTRO_VACIO } from "./shared/FiltroHistorial";
import type { FiltroHistorialState } from "./shared/FiltroHistorial";
import { Paginacion, PAGE_SIZE } from "./shared/Paginacion";
import { ModalActualizado } from "./shared/ModalActualizado";
import type { DatosActualizacion } from "./shared/ModalActualizado";
import { ProximasVigencias } from "./shared/ProximasVigencias";
import type { VigenciaFutura } from "./shared/ProximasVigencias";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOMBRE_MES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const lastDayOfMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const subOneDay = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,"0"), String(date.getDate()).padStart(2,"0")].join("-");
};
const computeFechaFin = (inicios: string[], idx: number) =>
  idx < 11 ? subOneDay(inicios[idx + 1]) : `${inicios[11].substring(0,4)}-12-31`;
const toIso = (y: number, m: number, d: number) =>
  `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

// ─── Estado Actual (solo lectura del monto vigente) ──────────────────────────

function EstadoActualMensualidad({ monto, montoFI }: { monto: number; montoFI: string }) {
  const YEAR = 2025;
  const [inicios] = useState<string[]>(
    Array.from({ length: 12 }, (_, i) => toIso(YEAR, i, 1)),
  );
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draftDay, setDraftDay] = useState(1);
  const [rowError, setRowError] = useState("");
  const [modalFecha, setModalFecha] = useState<DatosActualizacion | null>(null);
  const [iniciosState, setIniciosState] = useState(inicios);

  const handleEdit = (idx: number) => { setEditingIdx(idx); setDraftDay(parseInt(iniciosState[idx].split("-")[2])); setRowError(""); };
  const handleSaveRow = (idx: number) => {
    const max = lastDayOfMonth(YEAR, idx);
    if (draftDay < 1 || draftDay > max) { setRowError(`El día debe estar entre 1 y ${max} para ${NOMBRE_MES[idx]}`); return; }
    const anterior = iniciosState[idx];
    const nuevo = toIso(YEAR, idx, draftDay);
    const next = [...iniciosState]; next[idx] = nuevo;
    setIniciosState(next);
    setEditingIdx(null);
    setRowError("");
    setModalFecha({ etiqueta: `Fecha de inicio — ${NOMBRE_MES[idx]}`, descripcion: `Día ${parseInt(anterior.split("-")[2])} → Día ${draftDay}`, nuevaFechaInicio: nuevo, anteriorFechaInicio: anterior });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Monto vigente — solo lectura */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
        <p className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] mb-1">Monto de mensualidad vigente</p>
        <p className="font-['Montserrat',sans-serif] text-[36px] font-semibold text-[#308c58] mb-2">{fmtMonto(monto)}</p>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#6b7280]" />
          <span className="font-['Arimo',sans-serif] text-[14px] text-[#6b7280]">{fmtDate(montoFI)} — Presente</span>
        </div>
      </div>

      {/* Control de fechas por mes */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb]">
          <h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">Control de Fechas de Mensualidades del Año Presente</h4>
        </div>
        {rowError && <div className="mx-5 mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-[8px]"><p className="text-red-600 font-['Arimo',sans-serif] text-[13px]">{rowError}</p></div>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb]">
                <th className={TH_CLS}>Mes</th>
                <th className={TH_CLS}>Fecha de inicio</th>
                <th className={`${TH_CLS} text-[#6b7280]`}>Fecha de fin <span className="font-normal text-[11px]">(calculada)</span></th>
                <th className={`${TH_CLS} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }, (_, idx) => {
                const fechaFin = computeFechaFin(iniciosState, idx);
                const isEditing = editingIdx === idx;
                const max = lastDayOfMonth(YEAR, idx);
                return (
                  <tr key={idx} className="hover:bg-[#f9fafb] transition-colors">
                    <td className={`${TD_CLS} font-medium`}>{NOMBRE_MES[idx]}</td>
                    <td className={TD_CLS}>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] whitespace-nowrap">{NOMBRE_MES[idx]} {YEAR} — Día</span>
                          <input type="number" value={draftDay} min={1} max={max} onChange={(e) => setDraftDay(Number(e.target.value))} className={`${INPUT_CLS} h-[34px] py-1 text-[13px] w-[70px] text-center`} autoFocus />
                          <span className="font-['Arimo',sans-serif] text-[11px] text-[#abafb1]">(1–{max})</span>
                        </div>
                      ) : fmtDate(iniciosState[idx])}
                    </td>
                    <td className={`${TD_CLS} text-[#6b7280]`}>{fmtDate(fechaFin)}</td>
                    <td className={`${TD_CLS} text-right`}>
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleSaveRow(idx)} className="h-[30px] px-3 rounded-[6px] bg-[#308c58] text-white text-[12px] font-['Arimo',sans-serif] hover:bg-[#267045] cursor-pointer flex items-center gap-1"><Check size={12}/> Guardar</button>
                          <button onClick={() => { setEditingIdx(null); setRowError(""); }} className="h-[30px] px-2 rounded-[6px] border border-[#d1d5dc] text-[#6b7280] hover:bg-[#f9fafb] cursor-pointer"><X size={13}/></button>
                        </div>
                      ) : (
                        <button onClick={() => handleEdit(idx)} className="h-[30px] px-3 rounded-[6px] border border-[#d1d5dc] text-[#514f4f] text-[12px] font-['Arimo',sans-serif] hover:bg-[#f9fafb] cursor-pointer flex items-center gap-1 ml-auto"><Pencil size={12}/> Editar día</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modalFecha && <ModalActualizado datos={modalFecha} onClose={() => setModalFecha(null)} />}
    </div>
  );
}

// ─── Historial ────────────────────────────────────────────────────────────────

function HistorialMensualidad() {
  const [filtros, setFiltros] = useState<FiltroHistorialState>(FILTRO_VACIO);
  const [page, setPage] = useState(0);
  const editores = [...new Set(MENSUALIDAD_HISTORIAL.map((h) => h.editadoPor))];
  const filtrado = useMemo(() =>
    MENSUALIDAD_HISTORIAL.filter((h) => {
      const matchBusqueda = !filtros.busqueda || h.editadoPor.toLowerCase().includes(filtros.busqueda.toLowerCase());
      const matchDesde = !filtros.fechaDesde || h.fechaInicio >= filtros.fechaDesde;
      const matchHasta = !filtros.fechaHasta || h.fechaFin <= filtros.fechaHasta;
      const matchEditor = !filtros.editadoPor || h.editadoPor === filtros.editadoPor;
      return matchBusqueda && matchDesde && matchHasta && matchEditor;
    }), [filtros]);
  const pagina = filtrado.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const handleFiltros = (f: FiltroHistorialState) => { setFiltros(f); setPage(0); };
  return (
    <div className="flex flex-col gap-5">
      <FiltroHistorial filtros={filtros} onChange={handleFiltros} onLimpiar={() => { setFiltros(FILTRO_VACIO); setPage(0); }} editadoresList={editores} placeholder="Buscar por editor..." />
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb]"><h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">Cambios de Mensualidades</h4></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#f9fafb]"><th className={TH_CLS}>Rango de fecha de validez</th><th className={TH_CLS}>Monto</th><th className={TH_CLS}>Editado por</th><th className={TH_CLS}>Fecha de edición</th></tr></thead>
            <tbody>
              {pagina.length === 0
                ? <tr><td colSpan={4} className="text-center py-10 text-[#6b7280] font-['Arimo',sans-serif] text-[14px]">Sin registros</td></tr>
                : pagina.map((h) => (
                  <tr key={h.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className={TD_CLS}>{fmtDate(h.fechaInicio)} — {fmtDate(h.fechaFin)}</td>
                    <td className={TD_CLS}>{fmtMonto(h.monto)}</td>
                    <td className={TD_CLS}>{h.editadoPor}</td>
                    <td className={TD_CLS}>{fmtDate(h.editadoEl)}</td>
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

export function SeccionMensualidad({ subTab }: Props) {
  const [monto] = useState(300);
  const [montoFI] = useState("2025-01-01");
  const [vigencias, setVigencias] = useState<VigenciaFutura[]>([]);

  return (
    <>
      {subTab === "estado"    && <EstadoActualMensualidad monto={monto} montoFI={montoFI} />}
      {subTab === "proximas"  && (
        <ProximasVigencias
          etiqueta="Mensualidad"
          montoActual={monto}
          vigencias={vigencias}
          onAdd={(v) => setVigencias((p) => [...p, { id: Date.now(), ...v }])}
          onRemove={(id) => setVigencias((p) => p.filter((x) => x.id !== id))}
        />
      )}
      {subTab === "historial" && <HistorialMensualidad />}
    </>
  );
}
