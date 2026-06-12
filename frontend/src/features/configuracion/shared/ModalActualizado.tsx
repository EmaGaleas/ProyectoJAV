import { CheckCircle2, X } from "lucide-react";
import { fmtDate } from "../types";

export interface DatosActualizacion {
  etiqueta: string;          // "Monto de Mora", "Tarifa de Conexión", "Mensualidad", etc.
  descripcion: string;       // "Lps. 150.00 → Lps. 200.00" o texto libre
  nuevaFechaInicio: string;  // ISO — cuando entra en vigencia
  anteriorFechaInicio: string; // ISO — inicio del registro anterior
}

interface Props {
  datos: DatosActualizacion;
  onClose: () => void;
}

// Resta 1 día a fecha ISO sin problemas de zona horaria
const subOneDay = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

export function ModalActualizado({ datos, onClose }: Props) {
  const fechaFin = subOneDay(datos.nuevaFechaInicio);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4" style={{ zIndex: 60 }}>
        <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-md p-6 relative">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-[#f3f4f6] rounded-lg cursor-pointer"
          >
            <X size={18} className="text-[#6b7280]" />
          </button>

          {/* Icono */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-14 h-14 rounded-full bg-[#EBF5EF] flex items-center justify-center mb-3">
              <CheckCircle2 size={30} className="text-[#308c58]" />
            </div>
            <h3 className="font-['Montserrat',sans-serif] text-[18px] text-[#364153]">
              Información Actualizada
            </h3>
          </div>

          {/* Detalle */}
          <div className="bg-[#f9fafb] rounded-[10px] border border-[#e5e7eb] divide-y divide-[#e5e7eb] mb-5">
            <Row label="Dato" value={datos.etiqueta} />
            <Row label="Descripción" value={datos.descripcion} />
            <Row
              label="Entra en vigencia a partir de"
              value={fmtDate(datos.nuevaFechaInicio)}
              valueClass="text-[#308c58] font-medium"
            />
            <Row
              label="Rango de vigencia anterior"
              value={`${fmtDate(datos.anteriorFechaInicio)} — ${fmtDate(fechaFin)}`}
            />
          </div>

          <button
            onClick={onClose}
            className="w-full h-[44px] bg-[#308c58] rounded-[10px] text-white font-['Arimo',sans-serif] text-[15px] hover:bg-[#267045] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </>
  );
}

function Row({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-start gap-4 px-4 py-3">
      <span className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] shrink-0">{label}</span>
      <span className={`font-['Arimo',sans-serif] text-[14px] text-[#364153] text-right ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
