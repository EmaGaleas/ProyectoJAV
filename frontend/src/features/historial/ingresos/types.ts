
export type PaymentType  = 'Mensualidad' | 'Multa'
export type IncomeStatus = 'Procesado' | 'En revisión' | 'Rechazado'
export type PayMethod    = 'Efectivo' | 'Transferencia'


export interface InvoiceLine {
  id:         string
  concept:    string
  dueDate:    string
  baseAmount: number
  mora:       number
  type:       'mensualidad' | 'multa' | 'conexion'
}


export interface Income {
  id:            string
  receiptNumber: string
  holderName:    string
  dni:           string
  paymentType:   PaymentType
  date:          string        // ISO date string
  total:         number
  status:        IncomeStatus
  payMethod:     PayMethod
  transferCode?: string
  street:        string
  block:         string
  lot:           string
  lines:         InvoiceLine[]
}

// ─── Filtros ──────────────────────────────────────────────────────────────────

export interface IncomeFilters {
  paymentType: PaymentType | ''
  status:      IncomeStatus | ''
  dateFrom:    string
  dateTo:      string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const L       = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${d} ${meses[parseInt(m) - 1]} ${y}`;
};