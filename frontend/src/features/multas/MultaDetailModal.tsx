// MultaDetailModal.tsx
import { X, User, AlignLeft, MapPin, AlertCircle } from "lucide-react";
import type { MultaRecord } from "./types";
import { L } from "./types";
import { useEffect, useState } from "react";
import { api } from "../../../services/api";

interface Props {
  record: MultaRecord;
  onClose: () => void;
}

interface Location {
  calle: string;
  codigoBloque: string;
  loteCasa: string;
}

export function MultaDetailModal({ record, onClose }: Props) {
  const [ubicacion, setUbicacion] = useState<Location>();
  const direccionFormateada = ubicacion 
    ? `${ubicacion.calle}, Bloque ${ubicacion.codigoBloque}, Lote ${ubicacion.loteCasa}`
    : "Cargando ubicación...";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`api/usuarios/${record.idUsuario}`);
        // Asumiendo que domicilios es la propiedad que devuelve tu API real
        const domicilios = response.data.domicilios || response.data.direcciones || [];
        if (domicilios.length > 0) {
          setUbicacion(domicilios[0]);
        }
      } catch (error) {
        console.error("Error obteniendo info del usuario multado", error);
      }
    };
    if(record.idUsuario) fetchUserInfo();
  }, [record.idUsuario]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.40)", backdropFilter: "blur(3px)" }}
        onClick={onClose}
      >
        <div
          className="bg-white flex flex-col overflow-hidden"
          style={{ width: 480, maxHeight: "88vh", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-[rgba(0,0,0,0.06)] bg-[#F8FDFB]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 38, height: 38, background: "#308C58" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  <line x1="12" y1="12" x2="12" y2="16"></line>
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8EBFA3] tracking-widest uppercase block">
                  Detalle de la multa
                </span>
                <span className="text-base font-bold text-[#1A1A1A]">
                  {record.idMulta || record.idTipoMulta}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MultaStatusBadge status={record.estado} />
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
                style={{ width: 32, height: 32, color: "#8EBFA3", background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-5">
              <InfoSection title="Infractor" icon={<User size={13} />}>
                <UniformGrid cols={2}>
                  <InfoField label="Persona multada" value={record.nombreUsuario} />
                  <InfoField label="DNI" value={record.dni} />
                </UniformGrid>
              </InfoSection>

              <InfoSection title="Dirección del Infractor" icon={<MapPin size={13} />}>
                <InfoField label="Dirección" value={direccionFormateada} />
              </InfoSection>

              <InfoSection title="Detalles de la infracción" icon={<AlertCircle size={13} />}>
                <UniformGrid cols={2}>
                  <InfoField label="Monto" value={L(record.monto)} highlight />
                  <InfoField label="Tipo de multa" value={record.tipoDescripcion} />
                </UniformGrid>
              </InfoSection>

              <InfoSection title="Motivo de la multa" icon={<AlignLeft size={13} />}>
                <p className="text-[13px] font-medium text-[#1A1A1A] leading-relaxed m-0">
                  {record.tipoDescripcion || "—"}
                </p>
              </InfoSection>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MultaStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Pagada: { bg: "#e6f3ec", color: "#308C58" },
    Pendiente: { bg: "#fef9e7", color: "#b7791f" },
  };
  const s = map[status] ?? map["Pendiente"];
  return (
    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function InfoSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode; }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span style={{ color: "#308C58" }}>{icon}</span>
        <span className="text-[10px] font-bold text-[#308C58] tracking-widest uppercase">{title}</span>
      </div>
      <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ background: "#FAFAFA", border: "1px solid rgba(0,0,0,0.07)" }}>
        {children}
      </div>
    </div>
  );
}

function InfoField({ label, value, highlight }: { label: string; value?: string | null; highlight?: boolean; }) {
  const display = value?.trim() || "—";
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] font-semibold text-[#B0C8BA] uppercase tracking-wider">{label}</span>
      <span className="truncate" title={display !== "—" ? display : undefined} style={{ fontSize: 13, fontWeight: highlight ? 700 : 500, color: highlight ? "#308C58" : "#1A1A1A" }}>
        {display}
      </span>
    </div>
  );
}

function UniformGrid({ cols, children }: { cols: 2 | 3; children: React.ReactNode; }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 12 }}>{children}</div>;
}
