// types.ts
export type MultaStatus = "Aprobado" | "Pendiente" | "Vencido";
export interface TipoMulta {
  idMulta: number;
  tipoDescripcion: string;
}
// src/components/styles.ts
export const INPUT_CLS =
  "h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] placeholder:text-[#abafb1] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";
export const LABEL_CLS =
  "font-['Arimo',sans-serif] font-normal text-[#364153] text-[16px]";
export const SECTION_TITLE_CLS =
  "font-['Montserrat',sans-serif] font-normal text-[#364153] text-[18px] mb-4";
export const SELECT_CLS =
  "h-[45.6px] w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";
export const INPUT_LOCK =
  "h-[52px] w-full border border-[#e8eaeb] rounded-[8px] px-[16px] py-[8px] text-[16px] bg-[#f7f8f8] text-[#9fa3a5] cursor-not-allowed select-none";

// Nueva interfaz para la estructura exacta
export interface Ubicacion {
  street: string;
  block: string;
  lot: string;
}

export interface MultaRecord {
  idMulta: string;
  idTipoMulta: string;
  nombreUsuario: string;
  idUsuario: string;
  dni: string;
  ubicacion: Ubicacion;
  fecha?: string;
  monto: number;
  tipoDescripcion: string;
  estado: MultaStatus;
}

// Helpers
export const L = (n: number) =>
  `L ${n.toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${d} ${meses[parseInt(m) - 1]} ${y}`;
};
