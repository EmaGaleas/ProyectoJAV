// ─── Tipos base ───────────────────────────────────────────────────────────────

export type EgresoStatus = 'Aprobado' | 'Pendiente' | 'Rechazado'
export type UserRole     = 'SuperAdministrador' | 'Administrador' | 'Tesorero' | 'Fiscal'

export interface EgresoRecord {
  id:            string
  codigoEgreso:  string
  registradoPor: string
  dni:           string
  fecha:         string        // ISO date string
  monto:         number
  receptorPago:  string        // destinatario / cliente
  descripcion:   string
  facturaUrl:    string        // nombre del archivo o URL
  status:        EgresoStatus
  aprobadoPor?:  string        // se llena al aprobar
  rechazadoPor?: string        // se llena al rechazar
}

// ─── Payloads para PATCH /api/Egresos/:id/aprobar|rechazar ───────────────────

export interface AprobarEgresoPayload {
  Status:      'Aprobado'
  AprobadoPor: string
}

export interface RechazarEgresoPayload {
  Status:       'Rechazado'
  RechazadoPor: string
}

// ─── Metadatos de cada tab ────────────────────────────────────────────────────

export interface TabMeta {
  label:       EgresoStatus
  description: string
  note?:       string          // posdata opcional
}

export const TAB_META: TabMeta[] = [
  {
    label: 'Aprobado',
    description:
      'Todos los egresos que han pasado por una revisión y han sido aceptados como válidos.',
  },
  {
    label: 'Pendiente',
    description:
      'Todos los egresos registrados que aún no han sido revisados por un administrador.',
  },
  {
    label: 'Rechazado',
    description:
      'Todos los egresos que han pasado por una revisión y no cumplieron con los criterios establecidos.',
    note: 'Si un egreso fue rechazado, deberá ser ingresado nuevamente cumpliendo con los requisitos.',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const L       = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${d} ${meses[parseInt(m) - 1]} ${y}`;
};