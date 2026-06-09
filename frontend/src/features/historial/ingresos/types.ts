export type PaymentType  = 'Mensualidad' | 'Multa'
export type IncomeStatus = 'Procesado' | 'En revisión' | 'Rechazado'
export type PayMethod    = 'Efectivo' | 'Transferencia'

// ─── Lista (datos básicos para la tabla) ──────────────────────────────────────

export interface Income {
  id:           string
  receiptNumber: string
  holderName:   string
  dni:          string
  paymentType:  string
  date:         string        // YYYY-MM-DD
  total:        number
  status:       IncomeStatus
}

// ─── Detalle (datos completos para el modal) ──────────────────────────────────

export interface InvoiceLine {
  id:          string
  concept:     string
  dueDate:     string        // YYYY-MM-DD (vacío si nulo)
  baseAmount:  number
  mora:        number
  type:        'mensualidad' | 'multa' | 'conexion'
}

export interface IncomeDetail {
  id:              string
  receiptNumber:   string
  holderName:      string
  dni:             string
  paymentType:     string
  date:            string
  total:           number
  status:          string
  payMethod:       string
  transferCode?:   string
  street:          string
  block:           string
  lot:             string
  lines:           InvoiceLine[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const L       = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const fmtDate = (d: string) => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}
