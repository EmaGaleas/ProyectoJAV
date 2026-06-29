import { useState, useMemo, useEffect } from "react";
import { Pencil, Check, X, Calendar, Loader2 } from "lucide-react";
import { TH_CLS, TD_CLS, INPUT_CLS, fmtDate, fmtMonto } from "./types";
import { FiltroHistorial, FILTRO_VACIO } from "./shared/FiltroHistorial";
import type { FiltroHistorialState } from "./shared/FiltroHistorial";
import { Paginacion, PAGE_SIZE } from "./shared/Paginacion";
import { ModalActualizado } from "./shared/ModalActualizado";
import type { DatosActualizacion } from "./shared/ModalActualizado";
import { ProximasVigencias } from "./shared/ProximasVigencias";
import type { VigenciaFutura } from "./shared/ProximasVigencias";
import { toast } from 'react-toastify'
import * as mensualidadService from "./services/mensualidadService";
import type { MesFechaDto, MensualidadHistorialDto } from "./services/mensualidadService";


// ─── Helpers ──────────────────────────────────────────────────────────────────

const lastDayOfMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

const subOneDay = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
};

const computeFechaFin = (meses: MesFechaDto[], idx: number) =>
  idx < meses.length - 1 
    ? subOneDay(meses[idx + 1].fechaInicio) 
    : `${meses[meses.length - 1].fechaInicio.substring(0, 4)}-12-31`;

const toIso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// ─── Estado Actual (Lectura del monto vigente y control de jornadas) ─────────

function EstadoActualMensualidad({ monto, montoFI }: { monto: number; montoFI: string }) {
  const YEAR = new Date().getFullYear(); 
  const [meses, setMeses] = useState<MesFechaDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draftDay, setDraftDay] = useState(1);
  const [modalFecha, setModalFecha] = useState<DatosActualizacion | null>(null);
  // Eliminado: const [rowError, setRowError] = useState("");

  useEffect(() => {
    cargarMeses();
  }, []);

  const cargarMeses = async () => {
    try {
      const data = await mensualidadService.getFechasMeses(YEAR);
      setMeses(data);
    } catch (error) {
      console.error("Error cargando jornadas de cobro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx: number) => { 
    const mesObj = meses[idx];
    const mesNumber = parseInt(mesObj.fechaInicio.split("-")[1]) - 1;
    const currentMonth = new Date().getMonth();
    const isPastYear = YEAR < new Date().getFullYear();

    // Validación: Evitar editar meses pasados
    if (isPastYear || (YEAR === new Date().getFullYear() && mesNumber < currentMonth)) {
      toast.error("No se puede editar la jornada de cobro de un mes que ya ha pasado.");
      return;
    }

    setEditingIdx(idx); 
    setDraftDay(parseInt(mesObj.fechaInicio.split("-")[2])); 
  };

  const handleSaveRow = async (idx: number) => {
    const mesObj = meses[idx];
    const mesNumber = parseInt(mesObj.fechaInicio.split("-")[1]) - 1;
    const max = lastDayOfMonth(YEAR, mesNumber);
    
    if (draftDay < 1 || draftDay > max) { 
      toast.error(`El día debe estar entre 1 y ${max} para ${mesObj.mes}`); 
      return; 
    }
    
    const anterior = mesObj.fechaInicio;
    const nuevo = toIso(YEAR, mesNumber, draftDay);

    try {
      await mensualidadService.updateFechaInicio(mesObj.id, nuevo);
      
      const next = [...meses];
      next[idx] = { ...next[idx], fechaInicio: nuevo };
      setMeses(next);
      setEditingIdx(null);
      
      setModalFecha({ 
        etiqueta: `Fecha de inicio — ${mesObj.mes}`, 
        descripcion: `Día ${parseInt(anterior.split("-")[2])} → Día ${draftDay}`, 
        nuevaFechaInicio: nuevo, 
        anteriorFechaInicio: anterior 
      });
      toast.success("Fecha de jornada actualizada correctamente.");
    } catch (error: any) {
      // Reemplazo de rowError por toast
      toast.error(error.response?.data?.message || "Ocurrió un error al actualizar la jornada.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Monto vigente — solo lectura */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
        <p className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] mb-1">Monto de mensualidad vigente</p>
        <p className="font-['Montserrat',sans-serif] text-[36px] font-semibold text-[#308c58] mb-2">{fmtMonto(monto)}</p>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#6b7280]" />
          <span className="font-['Arimo',sans-serif] text-[14px] text-[#6b7280]">{montoFI ? `${fmtDate(montoFI)} — Presente` : "No hay monto registrado"}</span>
        </div>
      </div>

      {/* Control de fechas por mes */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb]">
          <h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">Control de Fechas de Mensualidades del Año Presente</h4>
        </div>
        
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-[#308c58]" size={24} />
                  </td>
                </tr>
              ) : meses.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-[#6b7280] font-['Arimo',sans-serif] text-[14px]">No se encontraron jornadas para este año.</td></tr>
              ) : (
                meses.map((mes, idx) => {
                  const fechaFin = computeFechaFin(meses, idx);
                  const isEditing = editingIdx === idx;
                  const mesNumber = parseInt(mes.fechaInicio.split("-")[1]) - 1;
                  const max = lastDayOfMonth(YEAR, mesNumber);
                  
                  return (
                    <tr key={mes.id} className="hover:bg-[#f9fafb] transition-colors">
                      <td className={`${TD_CLS} font-medium`}>{mes.mes}</td>
                      <td className={TD_CLS}>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] whitespace-nowrap">{mes.mes} {YEAR} — Día</span>
                            <input type="number" value={draftDay} min={1} max={max} onChange={(e) => setDraftDay(Number(e.target.value))} className={`${INPUT_CLS} h-[34px] py-1 text-[13px] w-[70px] text-center`} autoFocus />
                            <span className="font-['Arimo',sans-serif] text-[11px] text-[#abafb1]">(1–{max})</span>
                          </div>
                        ) : fmtDate(mes.fechaInicio)}
                      </td>
                      <td className={`${TD_CLS} text-[#6b7280]`}>{fmtDate(fechaFin)}</td>
                      <td className={`${TD_CLS} text-right`}>
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleSaveRow(idx)} className="h-[30px] px-3 rounded-[6px] bg-[#308c58] text-white text-[12px] font-['Arimo',sans-serif] hover:bg-[#267045] cursor-pointer flex items-center gap-1"><Check size={12}/> Guardar</button>
                            <button onClick={() => setEditingIdx(null)} className="h-[30px] px-2 rounded-[6px] border border-[#d1d5dc] text-[#6b7280] hover:bg-[#f9fafb] cursor-pointer"><X size={13}/></button>
                          </div>
                        ) : (
                          <button onClick={() => handleEdit(idx)} className="h-[30px] px-3 rounded-[6px] border border-[#d1d5dc] text-[#514f4f] text-[12px] font-['Arimo',sans-serif] hover:bg-[#f9fafb] cursor-pointer flex items-center gap-1 ml-auto"><Pencil size={12}/> Editar día</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
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
  const [historial, setHistorial] = useState<MensualidadHistorialDto[]>([]);
  const [filtros, setFiltros] = useState<FiltroHistorialState>(FILTRO_VACIO);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const data = await mensualidadService.getHistorial();
      setHistorial(data);
    } catch (error) {
      console.error("Error obteniendo historial", error);
    } finally {
      setLoading(false);
    }
  };

  const editores = [...new Set(historial.map((h) => h.editadoPor))];
  
  const filtrado = useMemo(() =>
    historial.filter((h) => {
      const matchBusqueda = !filtros.busqueda || h.editadoPor.toLowerCase().includes(filtros.busqueda.toLowerCase());
      const matchDesde = !filtros.fechaDesde || h.fechaInicio >= filtros.fechaDesde;
      const matchHasta = !filtros.fechaHasta || h.fechaFin <= filtros.fechaHasta;
      const matchEditor = !filtros.editadoPor || h.editadoPor === filtros.editadoPor;
      return matchBusqueda && matchDesde && matchHasta && matchEditor;
    }), [filtros, historial]);

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
                    <td className={TD_CLS}>{fmtDate(h.fechaInicio)} — {h.fechaFin ? fmtDate(h.fechaFin) : "N/A"}</td>
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
  const [monto, setMonto] = useState(0);
  const [montoFI, setMontoFI] = useState("");
  const [vigencias, setVigencias] = useState<VigenciaFutura[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const actual = await mensualidadService.getMontoActual();
      setMonto(actual.monto);
      setMontoFI(actual.fechaInicio);

      const proximas = await mensualidadService.getProximasVigencias();
      setVigencias(proximas);
    } catch (error) {
      console.error("Error al cargar datos principales", error);
    }
  };

  const handleAddProxima = async (v: Omit<VigenciaFutura, "id">) => {
    // Validación UI: Prevenir múltiples vigencias futuras antes de ir al backend
    if (vigencias.length > 0) {
      toast.error("Ya existe un precio programado para el futuro. Bórrelo o modifíquelo antes de registrar uno nuevo.");
      return;
    }

    try {
      const hoy = new Date().toISOString().split("T")[0];
      const esFutura = v.fechaInicio > hoy;

      const nueva = await mensualidadService.createProximaVigencia(v);

      if (esFutura) {
        setVigencias((p) => [...p, nueva]);
        toast.success("Próxima vigencia registrada correctamente.");
      } else {
        await cargarDatos(); 
        toast.success("La nueva vigencia ha entrado en efecto inmediatamente.");
      }
    } catch (error: any) {
      // Captura de errores de validación del backend (ej. monto incorrecto o fechas inválidas)
      toast.error(error.response?.data?.message || error.response?.data || "Ocurrió un error al registrar la vigencia.");
    }
  };

  const handleRemoveProxima = async (id: number) => {
    try {
      await mensualidadService.deleteProximaVigencia(id);
      setVigencias((p) => p.filter((x) => x.id !== id));
    } catch (error) {
      console.error("Error eliminando vigencia", error);
    }
  };

  return (
    <>
      {subTab === "estado"    && <EstadoActualMensualidad monto={monto} montoFI={montoFI} />}
      {subTab === "proximas"  && (
        <ProximasVigencias
          etiqueta="Mensualidad"
          montoActual={monto}
          vigencias={vigencias}
          onAdd={handleAddProxima}
          onRemove={handleRemoveProxima}
        />
      )}
      {subTab === "historial" && <HistorialMensualidad />}
    </>
  );
}