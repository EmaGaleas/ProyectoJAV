// ─── Tipos base ───────────────────────────────────────────────────────────────

export type EgresoStatus = 'Aprobado' | 'Pendiente' | 'Rechazado'
export type UserRole     = 'Presidente' | 'Tesorero' | 'Administrativo'

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
export const fmtDate = (d: string) => { const [y,m,day] = d.split('-'); return `${day}/${m}/${y}` }
