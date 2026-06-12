// ─── Shared UI tokens ────────────────────────────────────────────────────────

export const INPUT_CLS =
  "h-[45.6px] w-full px-4 py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] placeholder:text-[#abafb1] bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";

export const SELECT_CLS =
  "h-[45.6px] w-full px-4 py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58]";

export const LABEL_CLS =
  "font-['Arimo',sans-serif] font-normal text-[#364153] text-[14px]";

export const TH_CLS =
  "text-left px-4 py-3 font-['Arimo',sans-serif] text-[13px] text-[#6b7280] font-normal border-b border-[#e5e7eb]";

export const TD_CLS =
  "px-4 py-3 font-['Arimo',sans-serif] text-[14px] text-[#364153] border-b border-[#f3f4f6]";

export const BTN_PRIMARY =
  "h-[38px] px-4 rounded-[8px] bg-[#308c58] text-white font-['Arimo',sans-serif] text-[14px] hover:bg-[#267045] transition-colors cursor-pointer flex items-center gap-2";

export const BTN_OUTLINE =
  "h-[38px] px-4 rounded-[8px] border border-[#308c58] text-[#308c58] font-['Arimo',sans-serif] text-[14px] hover:bg-[#308c58]/5 transition-colors cursor-pointer flex items-center gap-2";

// ─── Mensualidad ─────────────────────────────────────────────────────────────

export interface MensualidadMes {
  id: number;
  mes: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface MensualidadHistorial {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  monto: number;
  editadoPor: string;
  editadoEl: string;
}

export const MESES_ACTUALES: MensualidadMes[] = [
  { id: 1,  mes: "Enero",      fechaInicio: "2025-01-01", fechaFin: "2025-01-31" },
  { id: 2,  mes: "Febrero",    fechaInicio: "2025-02-01", fechaFin: "2025-02-28" },
  { id: 3,  mes: "Marzo",      fechaInicio: "2025-03-01", fechaFin: "2025-03-31" },
  { id: 4,  mes: "Abril",      fechaInicio: "2025-04-01", fechaFin: "2025-04-30" },
  { id: 5,  mes: "Mayo",       fechaInicio: "2025-05-01", fechaFin: "2025-05-31" },
  { id: 6,  mes: "Junio",      fechaInicio: "2025-06-01", fechaFin: "2025-06-30" },
  { id: 7,  mes: "Julio",      fechaInicio: "2025-07-01", fechaFin: "2025-07-31" },
  { id: 8,  mes: "Agosto",     fechaInicio: "2025-08-01", fechaFin: "2025-08-31" },
  { id: 9,  mes: "Septiembre", fechaInicio: "2025-09-01", fechaFin: "2025-09-30" },
  { id: 10, mes: "Octubre",    fechaInicio: "2025-10-01", fechaFin: "2025-10-31" },
  { id: 11, mes: "Noviembre",  fechaInicio: "2025-11-01", fechaFin: "2025-11-30" },
  { id: 12, mes: "Diciembre",  fechaInicio: "2025-12-01", fechaFin: "2025-12-31" },
];

export const MENSUALIDAD_HISTORIAL: MensualidadHistorial[] = [
  { id: 1, fechaInicio: "2024-01-01", fechaFin: "2024-12-31", monto: 250,  editadoPor: "Admin García",    editadoEl: "2023-12-15" },
  { id: 2, fechaInicio: "2023-01-01", fechaFin: "2023-12-31", monto: 220,  editadoPor: "Admin López",     editadoEl: "2022-12-20" },
  { id: 3, fechaInicio: "2022-01-01", fechaFin: "2022-12-31", monto: 200,  editadoPor: "Admin Martínez",  editadoEl: "2021-12-18" },
  { id: 4, fechaInicio: "2021-01-01", fechaFin: "2021-12-31", monto: 180,  editadoPor: "Admin García",    editadoEl: "2020-12-10" },
  { id: 5, fechaInicio: "2020-01-01", fechaFin: "2020-12-31", monto: 160,  editadoPor: "Admin López",     editadoEl: "2019-12-05" },
];

// ─── Multas ──────────────────────────────────────────────────────────────────

export interface MultaTipo {
  id: number;
  tipo: string;
  descripcion: string;
  monto: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface MultaHistorial {
  id: number;
  tipo: string;
  montoAnterior: number;
  montoNuevo: number;
  fechaInicio: string;
  fechaFin: string;
  editadoPor: string;
  editadoEl: string;
}

export const MULTAS_ACTUALES: MultaTipo[] = [
  { id: 1, tipo: "Ruido excesivo",      descripcion: "Generación de ruido fuera del horario permitido",          monto: 500,  fechaInicio: "2025-01-01", fechaFin: "2025-12-31" },
  { id: 2, tipo: "Mascotas sin control",descripcion: "Mascotas fuera de las áreas designadas sin correa",       monto: 350,  fechaInicio: "2025-01-01", fechaFin: "2025-12-31" },
  { id: 3, tipo: "Basura mal dispuesta",descripcion: "Depósito de basura fuera del área y horario establecido", monto: 400,  fechaInicio: "2025-01-01", fechaFin: "2025-12-31" },
  { id: 4, tipo: "Estacionamiento",     descripcion: "Vehículo en zona prohibida o espacio ajeno",              monto: 300,  fechaInicio: "2025-01-01", fechaFin: "2025-12-31" },
  { id: 5, tipo: "Daño a propiedad",    descripcion: "Daño a instalaciones comunes de la colonia",              monto: 1500, fechaInicio: "2025-01-01", fechaFin: "2025-12-31" },
];

export const MULTAS_HISTORIAL: MultaHistorial[] = [
  { id: 1, tipo: "Ruido excesivo",      montoAnterior: 400, montoNuevo: 500, fechaInicio: "2025-01-01", fechaFin: "2025-12-31", editadoPor: "Admin García",   editadoEl: "2024-12-20" },
  { id: 2, tipo: "Mascotas sin control",montoAnterior: 300, montoNuevo: 350, fechaInicio: "2025-01-01", fechaFin: "2025-12-31", editadoPor: "Admin López",    editadoEl: "2024-12-20" },
  { id: 3, tipo: "Ruido excesivo",      montoAnterior: 350, montoNuevo: 400, fechaInicio: "2024-01-01", fechaFin: "2024-12-31", editadoPor: "Admin Martínez", editadoEl: "2023-12-15" },
  { id: 4, tipo: "Basura mal dispuesta",montoAnterior: 300, montoNuevo: 400, fechaInicio: "2025-01-01", fechaFin: "2025-12-31", editadoPor: "Admin García",   editadoEl: "2024-11-05" },
  { id: 5, tipo: "Daño a propiedad",    montoAnterior: 1200,montoNuevo: 1500,fechaInicio: "2025-01-01", fechaFin: "2025-12-31", editadoPor: "Admin López",    editadoEl: "2024-10-18" },
];

// ─── Conexión ─────────────────────────────────────────────────────────────────

export interface ConexionHistorial {
  id: number;
  monto: number;
  fechaInicio: string;
  fechaFin?: string;
  editadoPor: string;
}

export const CONEXION_ACTUAL = { monto: 2500, fechaInicio: "2025-01-01", fechaFin: "2025-12-31" };

export const CONEXION_HISTORIAL: ConexionHistorial[] = [
  { id: 1, monto: 2500, fechaInicio: "2025-01-01", fechaFin: "2025-12-31", editadoPor: "Admin García" },
  { id: 2, monto: 2200, fechaInicio: "2024-01-01", fechaFin: "2024-12-31", editadoPor: "Admin López" },
  { id: 3, monto: 2000, fechaInicio: "2023-01-01", fechaFin: "2023-12-31", editadoPor: "Admin Martínez" },
  { id: 4, monto: 1800, fechaInicio: "2022-01-01", fechaFin: "2022-12-31", editadoPor: "Admin García" },
  { id: 5, monto: 1500, fechaInicio: "2021-01-01", fechaFin: "2021-12-31", editadoPor: "Admin López" },
];

// ─── Mora ────────────────────────────────────────────────────────────────────

export interface MoraHistorial {
  id: number;
  monto: number;
  fechaInicio: string;
  fechaFin: string;
  editadoPor: string;
}

export const MORA_ACTUAL = { monto: 150, fechaInicio: "2025-01-01", fechaFin: "2025-12-31" };

export const MORA_HISTORIAL: MoraHistorial[] = [
  { id: 1, monto: 150, fechaInicio: "2025-01-01", fechaFin: "2025-12-31", editadoPor: "Admin García" },
  { id: 2, monto: 120, fechaInicio: "2024-01-01", fechaFin: "2024-12-31", editadoPor: "Admin López" },
  { id: 3, monto: 100, fechaInicio: "2023-01-01", fechaFin: "2023-12-31", editadoPor: "Admin Martínez" },
  { id: 4, monto: 80,  fechaInicio: "2022-01-01", fechaFin: "2022-12-31", editadoPor: "Admin García" },
  { id: 5, monto: 60,  fechaInicio: "2021-01-01", fechaFin: "2021-12-31", editadoPor: "Admin López" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${d} ${meses[parseInt(m) - 1]} ${y}`;
};

export const fmtMonto = (n: number) =>
  `Lps. ${n.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`;
