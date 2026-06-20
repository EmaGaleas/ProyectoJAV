import { useState, useMemo, useEffect } from "react";
import { Plus, Pencil, X, Check, Trash2, Search, Clock, Loader2 } from "lucide-react";
import { TH_CLS, TD_CLS, INPUT_CLS, fmtDate, fmtMonto } from "./types";
import { FiltroHistorial, FILTRO_VACIO } from "./shared/FiltroHistorial";
import type { FiltroHistorialState } from "./shared/FiltroHistorial";
import { Paginacion, PAGE_SIZE } from "./shared/Paginacion";
import { toast } from 'react-toastify';

import * as multasService from "./services/multasService";
import type { MultaTipoDto, MultaHistorialDto, ProximaMultaDto } from "./services/multasService";

const today = () => new Date().toISOString().split("T")[0];

// ─── Modal Añadir tipo (solo para estado actual, nueva multa inmediata) ───────

interface ModalMultaProps {
  initial?: MultaTipoDto;
  onSave: (data: Omit<MultaTipoDto, "id">) => Promise<void>;
  onClose: () => void;
}

function ModalMulta({ initial, onSave, onClose }: ModalMultaProps) {
  const [form, setForm] = useState({
    tipo: initial?.tipo ?? "",
    monto: String(initial?.monto ?? ""),
    fechaInicio: initial?.fechaInicio ?? today(),
  });
  const [guardando, setGuardando] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));
  
  // Si estamos editando, solo exigimos el nombre del tipo. Si es nuevo, todo es obligatorio.
  const valid = initial 
    ? form.tipo.trim() && !guardando
    : form.tipo.trim() && form.monto && form.fechaInicio && !guardando;

  const handleGuardar = async () => {
    if (!initial && form.fechaInicio < today()) {
      toast.error("La fecha de inicio no puede ser anterior a hoy.");
      return;
    }
    setGuardando(true);
    try {
      await onSave({
        tipo: form.tipo.trim(),
        monto: Number(form.monto),
        fechaInicio: form.fechaInicio,
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-['Montserrat',sans-serif] text-[18px] text-[#364153]">
              {initial ? "Editar Nombre de Multa" : "Añadir Tipo de Multa"}
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg cursor-pointer"><X size={20} className="text-[#6b7280]" /></button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Tipo <span className="text-red-500">*</span></label>
              <input type="text" value={form.tipo} onChange={(e) => set("tipo", e.target.value)} placeholder="Ej: Ruido excesivo" className={INPUT_CLS} disabled={guardando} />
            </div>
            
            {!initial && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Monto (Lps.) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.monto} onChange={(e) => set("monto", e.target.value)} placeholder="0.00" min="0" className={INPUT_CLS} disabled={guardando} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Fecha de inicio de vigencia <span className="text-red-500">*</span></label>
                  <input type="date" value={form.fechaInicio} onChange={(e) => set("fechaInicio", e.target.value)} className={INPUT_CLS} disabled={guardando} />
                </div>
              </>
            )}
            
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onClose} disabled={guardando} className="h-[42px] px-4 rounded-[8px] border border-[#d1d5dc] text-[#514f4f] font-['Arimo',sans-serif] text-[14px] hover:bg-[#f9fafb] cursor-pointer disabled:opacity-50">Cancelar</button>
            <button
              disabled={!valid}
              onClick={handleGuardar}
              className="h-[42px] px-4 rounded-[8px] bg-[#308c58] text-white font-['Arimo',sans-serif] text-[14px] hover:bg-[#267045] cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} 
              {initial ? "Guardar cambios" : "Añadir tipo"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Estado Actual (Lectura API + Añadir / Editar tipos vigentes) ──────────

function EstadoActualMultas({ multas, setMultas, loading }: { multas: MultaTipoDto[]; setMultas: React.Dispatch<React.SetStateAction<MultaTipoDto[]>>; loading: boolean }) {
  const [modal, setModal] = useState<{ mode: "add" | "edit"; item?: MultaTipoDto } | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(0);

  const filtradas = useMemo(
    () => multas.filter((m) => !busqueda || m.tipo.toLowerCase().includes(busqueda.toLowerCase())),
    [multas, busqueda],
  );
  const pagina = filtradas.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSave = async (data: Omit<MultaTipoDto, "id">) => {
    try {
      if (modal?.mode === "edit" && modal.item) {
        await multasService.updateMulta(modal.item.id, data.tipo);
        setMultas((p) => p.map((m) => (m.id === modal.item!.id ? { ...m, tipo: data.tipo } : m)));
        toast.success("Nombre de multa actualizado");
      } else {
        const nueva = await multasService.createMulta(data);
        setMultas((p) => [...p, nueva]);
        toast.success("Tipo de multa añadido correctamente");
      }
      setModal(null);
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la multa");
    }
  };

  return (
    <>
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">Tipos de Multa Vigentes</h4>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#abafb1] pointer-events-none" />
              <input type="text" value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPage(0); }} placeholder="Buscar tipo..." className={`${INPUT_CLS} pl-9 h-[38px] text-[13px] w-[210px]`} />
            </div>
            <button onClick={() => setModal({ mode: "add" })} className="h-[38px] px-3 rounded-[8px] bg-[#308c58] text-white font-['Arimo',sans-serif] text-[13px] hover:bg-[#267045] cursor-pointer flex items-center gap-2">
              <Plus size={15} /> Añadir Tipo
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb]">
                <th className={TH_CLS}>Tipo</th><th className={TH_CLS}>Monto</th><th className={TH_CLS}>Vigencia desde</th><th className={`${TH_CLS} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-[#308c58]" size={24} />
                  </td>
                </tr>
              ) : pagina.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-[#6b7280] font-['Arimo',sans-serif] text-[14px]">Sin tipos de multa</td></tr>
              ) : (
                pagina.map((m) => (
                  <tr key={m.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className={`${TD_CLS} font-medium`}>{m.tipo}</td>
                    <td className={TD_CLS}>{fmtMonto(m.monto)}</td>
                    <td className={`${TD_CLS} text-[13px]`}>{fmtDate(m.fechaInicio)} — Presente</td>
                    <td className={`${TD_CLS} text-right`}>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setModal({ mode: "edit", item: m })} className="h-[30px] px-3 rounded-[6px] border border-[#d1d5dc] text-[#514f4f] text-[12px] font-['Arimo',sans-serif] hover:bg-[#f9fafb] cursor-pointer flex items-center gap-1"><Pencil size={12}/> Editar Nombre</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Paginacion total={filtradas.length} page={page} onChange={setPage} />
      </div>
      {modal && <ModalMulta initial={modal.mode === "edit" ? modal.item : undefined} onSave={handleSave} onClose={() => setModal(null)} />}
    </>
  );
}

// ─── Próximas Vigencias para Multas ──────────────────────────────────────────

function ProximasVigenciasMultas({ multasActuales }: { multasActuales: MultaTipoDto[] }) {
  const [proximas, setProximas] = useState<ProximaMultaDto[]>([]);
  const [form, setForm] = useState({ tipo: "", monto: "", fechaInicio: "" });
  const [loading, setLoading] = useState(true);
  const todayStr = today();
  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    cargarProximas();
  }, []);

  const cargarProximas = async () => {
    try {
      const data = await multasService.getProximasVigencias();
      setProximas(data);
    } catch (err) {
      toast.error("Error al cargar las próximas vigencias");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.tipo.trim()) { toast.error("Ingresa el tipo de multa."); return; }
    if (!form.monto || Number(form.monto) <= 0) { toast.error("Ingresa un monto válido."); return; }
    if (!form.fechaInicio) { toast.error("Selecciona la fecha de inicio."); return; }
    if (form.fechaInicio <= todayStr) { toast.error("La fecha de inicio debe ser posterior a hoy."); return; }

    // Validación solicitada: Evitar ingresar vigencia si ya existe una para ese tipo
    const tipoNormalizado = form.tipo.trim().toLowerCase();
    const yaExiste = proximas.some(p => p.tipo.toLowerCase() === tipoNormalizado);
    if (yaExiste) {
      toast.error("Ya existe una vigencia programada para este tipo de multa. Modifíquela o elimínela primero.");
      return;
    }

    try {
      const nueva = await multasService.createProximaVigencia({
        tipo: form.tipo,
        monto: Number(form.monto),
        fechaInicio: form.fechaInicio
      });
      setProximas((p) => [...p, nueva]);
      setForm({ tipo: "", monto: "", fechaInicio: "" });
      toast.success("Multa futura programada con éxito");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Error al programar el costo de la multa.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await multasService.deleteProximaVigencia(id);
      setProximas((p) => p.filter((x) => x.id !== id));
      toast.success("Vigencia programada eliminada");
    } catch (err) {
      toast.error("Error al eliminar la próxima vigencia");
    }
  };

  const tipos = multasActuales.map((m) => m.tipo);

  return (
    <div className="flex flex-col gap-5">
      {/* Formulario */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
        <h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153] mb-4">
          Programar cambio de multa o nuevo tipo futuro
        </h4>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Tipo <span className="text-red-500">*</span></label>
            <input
              type="text"
              list="tipos-multa"
              value={form.tipo}
              onChange={(e) => set("tipo", e.target.value)}
              placeholder="Selecciona o escribe uno nuevo"
              className={INPUT_CLS}
            />
            <datalist id="tipos-multa">
              {tipos.map((t) => <option key={t} value={t} />)}
            </datalist>
          </div>
          <div className="flex flex-col gap-1 min-w-[150px]">
            <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Monto (Lps.) <span className="text-red-500">*</span></label>
            <input type="number" value={form.monto} onChange={(e) => set("monto", e.target.value)} placeholder="0.00" min="1" className={INPUT_CLS} />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Entra en vigencia <span className="text-red-500">*</span></label>
            <input type="date" value={form.fechaInicio} min={todayStr} onChange={(e) => set("fechaInicio", e.target.value)} className={INPUT_CLS} />
          </div>
          <button onClick={handleAdd} className="h-[45.6px] px-5 rounded-[10px] bg-[#308c58] text-white font-['Arimo',sans-serif] text-[14px] hover:bg-[#267045] cursor-pointer flex items-center gap-2 transition-colors">
            <Plus size={16} /> Programar
          </button>
        </div>
      </div>

      {/* Tabla de próximas */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3">
          <Clock size={16} className="text-[#308c58]" />
          <h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">Multas programadas</h4>
          {proximas.length > 0 && <span className="ml-auto px-2 py-0.5 rounded-full bg-[#e6f3ec] text-[#308c58] font-['Arimo',sans-serif] text-[12px]">{proximas.length}</span>}
        </div>
        {loading ? (
          <div className="py-10"><Loader2 className="animate-spin mx-auto text-[#308c58]" size={24} /></div>
        ) : proximas.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-[#6b7280]"><Clock size={28} className="opacity-30" /><p className="font-['Arimo',sans-serif] text-[14px]">No hay multas programadas</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#f9fafb]"><th className={TH_CLS}>Tipo</th><th className={TH_CLS}>Monto</th><th className={TH_CLS}>Entra en vigencia</th><th className={`${TH_CLS} text-right`}>Acciones</th></tr></thead>
              <tbody>
                {[...proximas].sort((a,b)=>a.fechaInicio.localeCompare(b.fechaInicio)).map((v) => (
                  <tr key={v.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className={`${TD_CLS} font-medium`}>{v.tipo}</td>
                    <td className={`${TD_CLS} font-medium text-[#308c58]`}>{fmtMonto(v.monto)}</td>
                    <td className={TD_CLS}>{fmtDate(v.fechaInicio)}</td>
                    <td className={`${TD_CLS} text-right`}>
                      <button onClick={() => handleDelete(v.id)} className="h-[30px] px-2 rounded-[6px] border border-red-200 text-red-400 hover:bg-red-50 cursor-pointer transition-colors"><Trash2 size={13}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Historial ────────────────────────────────────────────────────────────────
// ─── Historial ────────────────────────────────────────────────────────────────

function HistorialMultas({ historial, loading }: { historial: MultaHistorialDto[]; loading: boolean }) {
  const [filtros, setFiltros] = useState<FiltroHistorialState>(FILTRO_VACIO);
  const [page, setPage] = useState(0);
  const editores = [...new Set(historial.map((h) => h.editadoPor))];
  
  const filtrado = useMemo(() =>
    historial.filter((h) => {
      const q = filtros.busqueda.toLowerCase();
      // Cambiamos h.tipo por h.multaAfectada en el filtro
      const matchBusqueda = !filtros.busqueda || h.multaAfectada.toLowerCase().includes(q) || h.editadoPor.toLowerCase().includes(q);
      const matchDesde = !filtros.fechaDesde || h.fechaInicio >= filtros.fechaDesde;
      const matchHasta = !filtros.fechaHasta || h.fechaFin <= filtros.fechaHasta;
      const matchEditor = !filtros.editadoPor || h.editadoPor === filtros.editadoPor;
      return matchBusqueda && matchDesde && matchHasta && matchEditor;
    }), [filtros, historial]);
    
  const pagina = filtrado.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const handleFiltros = (f: FiltroHistorialState) => { setFiltros(f); setPage(0); };

  return (
    <div className="flex flex-col gap-5">
      <FiltroHistorial filtros={filtros} onChange={handleFiltros} onLimpiar={() => { setFiltros(FILTRO_VACIO); setPage(0); }} editadoresList={editores} placeholder="Buscar por tipo o editor..." />
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb]"><h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">Historial de Cambios en Multas</h4></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb]">
                <th className={TH_CLS}>Multa afectada</th>
                <th className={TH_CLS}>Monto</th>
                <th className={TH_CLS}>Vigencia (inicio — fin)</th>
                <th className={TH_CLS}>Editado por</th>
                <th className={TH_CLS}>Fecha de edición</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-[#308c58]" size={24} />
                  </td>
                </tr>
              ) : pagina.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-[#6b7280] font-['Arimo',sans-serif] text-[14px]">Sin registros</td></tr>
              ) : (
                pagina.map((h) => (
                  <tr key={h.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className={`${TD_CLS} font-medium`}>{h.multaAfectada}</td>
                    <td className={TD_CLS}>{fmtMonto(h.monto)}</td>
                    <td className={`${TD_CLS} text-[13px]`}>{fmtDate(h.fechaInicio)} — {h.fechaFin ? fmtDate(h.fechaFin) : "N/A"}</td>
                    <td className={TD_CLS}>{h.editadoPor}</td>
                    <td className={TD_CLS}>{fmtDate(h.editadoEl)}</td>
                  </tr>
                ))
              )}
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

export function SeccionMultas({ subTab }: Props) {
  const [multas, setMultas] = useState<MultaTipoDto[]>([]);
  const [historial, setHistorial] = useState<MultaHistorialDto[]>([]);
  
  const [loadingMultas, setLoadingMultas] = useState(true);
  const [loadingHistorial, setLoadingHistorial] = useState(true);

  useEffect(() => {
    const cargarMultasVigentes = async () => {
      try {
        setLoadingMultas(true);
        const data = await multasService.getMultasVigentes();
        setMultas(data);
      } catch (err) {
        toast.error("Error cargando multas");
      } finally {
        setLoadingMultas(false);
      }
    };
    cargarMultasVigentes();
  }, []);

  useEffect(() => {
    if (subTab === "historial") {
      const cargarHistorialMultas = async () => {
        try {
          setLoadingHistorial(true);
          const data = await multasService.getHistorial();
          setHistorial(data);
        } catch (err) {
          toast.error("Error cargando historial");
        } finally {
          setLoadingHistorial(false);
        }
      };
      cargarHistorialMultas();
    }
  }, [subTab]);

  return (
    <>
      {subTab === "estado"    && <EstadoActualMultas multas={multas} setMultas={setMultas} loading={loadingMultas} />}
      {subTab === "proximas"  && <ProximasVigenciasMultas multasActuales={multas} />}
      {subTab === "historial" && <HistorialMultas historial={historial} loading={loadingHistorial} />}
    </>
  );
}