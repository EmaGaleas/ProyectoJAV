import { useState, useMemo, useEffect } from "react";
import { Calendar, Loader2 } from "lucide-react";
import type { ConexionHistorial } from "./types";
import { TH_CLS, TD_CLS, fmtDate, fmtMonto } from "./types";
import { FiltroHistorial, FILTRO_VACIO } from "./shared/FiltroHistorial";
import type { FiltroHistorialState } from "./shared/FiltroHistorial";
import { Paginacion, PAGE_SIZE } from "./shared/Paginacion";
import { ProximasVigencias } from "./shared/ProximasVigencias";
import type { VigenciaFutura } from "./shared/ProximasVigencias";
import { 
  getConexionActual, 
  getHistorial, 
  getProximasVigencias, 
  createProximaVigencia, 
  deleteProximaVigencia 
} from "./services/conexionService"; // Asegúrate de que la ruta sea correcta

// ─── Estado Actual (solo lectura) ─────────────────────────────────────────────

function EstadoActualConexion({ monto, fechaInicio }: { monto: number; fechaInicio: string }) {
  if (!fechaInicio) return <p className="text-gray-500">No hay tarifa de conexión configurada.</p>;
  
  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
        <p className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] mb-1">Tarifa de conexión vigente</p>
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

function HistorialConexion({ historial }: { historial: ConexionHistorial[] }) {
  const [filtros, setFiltros] = useState<FiltroHistorialState>(FILTRO_VACIO);
  const [page, setPage] = useState(0);
  const editores = [...new Set(historial.map((h) => h.editadoPor))];
  const filtrado = useMemo(() =>
    historial.filter((h) => {
      const q = filtros.busqueda.toLowerCase();
      const matchBusqueda = !filtros.busqueda || h.editadoPor.toLowerCase().includes(q) || String(h.monto).includes(filtros.busqueda);
      const matchDesde = !filtros.fechaDesde || h.fechaInicio >= filtros.fechaDesde;
      const matchHasta = !filtros.fechaHasta || (h.fechaFin != null && h.fechaFin <= filtros.fechaHasta);
      const matchEditor = !filtros.editadoPor || h.editadoPor === filtros.editadoPor;
      return matchBusqueda && matchDesde && matchHasta && matchEditor;
    }), [filtros, historial]);
  const pagina = filtrado.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const handleFiltros = (f: FiltroHistorialState) => { setFiltros(f); setPage(0); };

  return (
    <div className="flex flex-col gap-5">
      <FiltroHistorial filtros={filtros} onChange={handleFiltros} onLimpiar={() => { setFiltros(FILTRO_VACIO); setPage(0); }} editadoresList={editores} placeholder="Buscar por monto o editor..." />
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb]"><h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">Historial de Montos para Conexión</h4></div>
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

export function SeccionConexion({ subTab }: Props) {
  const [monto, setMonto] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [historial, setHistorial] = useState<ConexionHistorial[]>([]);
  const [vigencias, setVigencias] = useState<VigenciaFutura[]>([]);
  const [loading, setLoading] = useState(false);

  // Efecto para cargar datos dependiendo de la pestaña activa
  useEffect(() => {
    let isMounted = true;
    const fetchTabContent = async () => {
      setLoading(true);
      try {
        if (subTab === "estado") {
          const actual = await getConexionActual();
          if (isMounted) {
            setMonto(actual.monto);
            setFechaInicio(actual.fechaInicio);
          }
        } 
        else if (subTab === "proximas") {
          const [actual, proximas] = await Promise.all([
            getConexionActual(),
            getProximasVigencias()
          ]);
          if (isMounted) {
            setMonto(actual.monto);
            setVigencias(proximas);
          }
        } 
        else if (subTab === "historial") {
          const historico = await getHistorial();
          if (isMounted) {
            // Mapeamos para que coincida exactamente con la interfaz del componente
            setHistorial(historico.map(h => ({
              id: h.id,
              monto: h.monto,
              fechaInicio: h.fechaInicio,
              fechaFin: h.fechaFin,
              editadoPor: h.editadoPor
            })));
          }
        }
      } catch (error) {
        console.error("Error cargando los datos de conexión:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTabContent();

    return () => {
      isMounted = false; // Cleanup para evitar fugas de memoria
    };
  }, [subTab]);

  // Handlers para las acciones en ProximasVigencias
  const handleAddVigencia = async (nuevaVigencia: Omit<VigenciaFutura, "id">) => {
    try {
      const response = await createProximaVigencia(nuevaVigencia);
      setVigencias((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error al registrar nueva vigencia:", error);
      // Aquí podrías agregar un toast o alerta de error para el usuario
    }
  };

  const handleRemoveVigencia = async (id: number) => {
    try {
      await deleteProximaVigencia(id);
      setVigencias((prev) => prev.filter((x) => x.id !== id));
    } catch (error) {
      console.error("Error al eliminar la vigencia:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-500">
        <Loader2 className="animate-spin mr-2" size={24} />
        <span className="font-['Arimo',sans-serif]">Cargando información...</span>
      </div>
    );
  }

  return (
    <>
      {subTab === "estado"    && <EstadoActualConexion monto={monto} fechaInicio={fechaInicio} />}
      {subTab === "proximas"  && (
        <ProximasVigencias
          etiqueta="Conexión"
          montoActual={monto}
          vigencias={vigencias}
          onAdd={handleAddVigencia}
          onRemove={handleRemoveVigencia}
        />
      )}
      {subTab === "historial" && <HistorialConexion historial={historial} />}
    </>
  );
}