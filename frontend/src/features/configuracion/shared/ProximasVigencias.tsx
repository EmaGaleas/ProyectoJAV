import { useState } from "react";
import { toast } from "react-toastify"; // <-- Agregamos react-toastify
import { Plus, Trash2, Clock } from "lucide-react";
import { INPUT_CLS, TH_CLS, TD_CLS, fmtDate, fmtMonto } from "../types";

export interface VigenciaFutura {
  id: number;
  monto: number;
  fechaInicio: string;
}

interface Props {
  etiqueta: string;           // "Mensualidad", "Mora", "Tarifa de Conexión"
  montoActual: number;
  vigencias: VigenciaFutura[];
  onAdd: (v: Omit<VigenciaFutura, "id">) => void;
  onRemove: (id: number) => void;
}

export function ProximasVigencias({ etiqueta, montoActual, vigencias, onAdd, onRemove }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [monto, setMonto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  // Eliminado: const [error, setError] = useState("");

  const handleAdd = () => {
    // Reemplazamos los setError por toast.error
    if (!monto || Number(monto) <= 0) { 
      toast.error("Ingresa un monto válido."); 
      return; 
    }
    if (!fechaInicio) { 
      toast.error("Selecciona la fecha de inicio de vigencia."); 
      return; 
    }
    if (fechaInicio <= today) { 
      toast.error("La fecha de inicio debe ser posterior a hoy."); 
      return; 
    }
    
    onAdd({ monto: Number(monto), fechaInicio });
    setMonto("");
    setFechaInicio("");
  };

  const sorted = [...vigencias].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));

  return (
    <div className="flex flex-col gap-5">
      {/* Formulario */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
        <h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153] mb-1">
          Programar nuevo monto — {etiqueta}
        </h4>
        <p className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] mb-4">
          Monto actual: <span className="text-[#308c58] font-medium">{fmtMonto(montoActual)}</span>
        </p>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1 min-w-[160px]">
            <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">
              Nuevo monto (Lps.) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={monto}
              // Eliminado: setError("")
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              min="1"
              className={INPUT_CLS}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">
              Entra en vigencia <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaInicio}
              min={today}
              // Eliminado: setError("")
              onChange={(e) => setFechaInicio(e.target.value)}
              className={INPUT_CLS}
            />
          </div>
          <button
            onClick={handleAdd}
            className="h-[45.6px] px-5 rounded-[10px] bg-[#308c58] text-white font-['Arimo',sans-serif] text-[14px] hover:bg-[#267045] cursor-pointer flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Programar
          </button>
        </div>

        {/* Eliminado el bloque que renderizaba el error visualmente ({error && <p>...}) */}
      </div>

      {/* Tabla de próximas vigencias */}
      <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center gap-3">
          <Clock size={16} className="text-[#308c58]" />
          <h4 className="font-['Montserrat',sans-serif] text-[15px] text-[#364153]">
            Montos programados
          </h4>
          {sorted.length > 0 && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-[#e6f3ec] text-[#308c58] font-['Arimo',sans-serif] text-[12px]">
              {sorted.length}
            </span>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-[#6b7280]">
            <Clock size={28} className="opacity-30" />
            <p className="font-['Arimo',sans-serif] text-[14px]">No hay montos programados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb]">
                  <th className={TH_CLS}>Nuevo monto</th>
                  <th className={TH_CLS}>Entra en vigencia</th>
                  <th className={`${TH_CLS} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((v) => (
                  <tr key={v.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className={`${TD_CLS} font-medium text-[#308c58]`}>{fmtMonto(v.monto)}</td>
                    <td className={TD_CLS}>{fmtDate(v.fechaInicio)}</td>
                    <td className={`${TD_CLS} text-right`}>
                      <button
                        onClick={() => onRemove(v.id)}
                        className="h-[30px] px-2 rounded-[6px] border border-red-200 text-red-400 hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
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