import { apiFetch } from '../../../services/apiClient'
import type { Income, IncomeDetail, IncomeStatus, InvoiceLine } from './types'
import type { Filters } from './IncomeFilters'

// ─── Shapes de respuesta del backend (camelCase) ──────────────────────────────

interface IngresoApiResponse {
  id:          number
  codigo:      string
  tipoIngreso: string
  titular:     string
  dni:         string
  fecha:       string
  monto:       number
  estado:      string
}

interface LineaApiResponse {
  concepto:          string
  fechaVencimiento?: string
  montoBase:         number
  mora:              number
  tipo:              string
}

interface DetallePagoApiResponse {
  titular:             string
  dni:                 string
  numeroComprobante:   string
  calle:               string
  bloque:              string
  lote:                number
  metodoPago:          string
  codigoTransferencia?: string
  fecha:               string
  tipoPago:            string
  estado:              string
  montoTotal:          number
  lineas:              LineaApiResponse[]
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

const ESTADO_MAP: Record<string, IncomeStatus> = {
  Pagado:    'Procesado',
  Pendiente: 'En revisión',
  Vencido:   'Rechazado',
}

function mapToIncome(r: IngresoApiResponse): Income {
  return {
    id:           String(r.id),
    receiptNumber: r.codigo,
    holderName:   r.titular,
    dni:          r.dni,
    paymentType:  r.tipoIngreso,
    date:         r.fecha.split('T')[0],
    total:        r.monto,
    status:       ESTADO_MAP[r.estado] ?? 'Procesado',
  }
}

function mapToDetail(id: string, r: DetallePagoApiResponse): IncomeDetail {
  const lines: InvoiceLine[] = r.lineas.map((l, i) => ({
    id:         String(i),
    concept:    l.concepto,
    dueDate:    l.fechaVencimiento ? l.fechaVencimiento.split('T')[0] : '',
    baseAmount: l.montoBase,
    mora:       l.mora,
    type:       l.tipo as 'mensualidad' | 'multa' | 'conexion',
  }))

  return {
    id,
    receiptNumber:  r.numeroComprobante,
    holderName:     r.titular,
    dni:            r.dni,
    paymentType:    r.tipoPago,
    date:           r.fecha.split('T')[0],
    total:          r.montoTotal,
    status:         ESTADO_MAP[r.estado] ?? 'Procesado',
    payMethod:      r.metodoPago,
    transferCode:   r.codigoTransferencia,
    street:         r.calle,
    block:          r.bloque,
    lot:            String(r.lote),
    lines,
  }
}

// ─── Funciones de API ─────────────────────────────────────────────────────────

export async function fetchIngresos(filtros: Partial<Filters>, token: string): Promise<Income[]> {
  const params = new URLSearchParams()
  if (filtros.paymentType) params.set('tipoPago', filtros.paymentType)
  if (filtros.status)      params.set('estado',   filtros.status)
  if (filtros.dateFrom)    params.set('desde',    filtros.dateFrom)
  if (filtros.dateTo)      params.set('hasta',    filtros.dateTo)

  const query = params.toString() ? `?${params.toString()}` : ''
  const data = await apiFetch<IngresoApiResponse[]>(`/api/Pagos${query}`, undefined, token)
  return data.map(mapToIncome)
}

export async function fetchDetalleIngreso(id: string, token: string): Promise<IncomeDetail> {
  const data = await apiFetch<DetallePagoApiResponse>(`/api/Pagos/${id}/detalle`, undefined, token)
  return mapToDetail(id, data)
}
