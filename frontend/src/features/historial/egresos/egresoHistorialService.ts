import { apiFetch } from '../../../services/apiClient'
import type { EgresoRecord, EgresoStatus } from './types'

interface EgresoResponse {
  id:            number
  codigoEgreso:  string
  registradoPor: string
  dni:           string
  titulo:        string
  descripcion:   string
  monto:         number
  fecha:         string
  facturaUrl:    string
  estado:        string
  aprobadoPor:   string | null
}

const STATUS_MAP: Record<string, EgresoStatus> = {
  EnRevision: 'Pendiente',
  Aprobado:   'Aprobado',
  Rechazado:  'Rechazado',
}

function mapToRecord(r: EgresoResponse): EgresoRecord {
  return {
    id:            String(r.id),
    codigoEgreso:  r.codigoEgreso,
    registradoPor: r.registradoPor,
    dni:           r.dni,
    fecha:         r.fecha.split('T')[0],
    monto:         r.monto,
    receptorPago:  r.titulo,
    descripcion:   r.descripcion,
    facturaUrl:    r.facturaUrl,
    status:        STATUS_MAP[r.estado] ?? 'Pendiente',
    aprobadoPor:   r.aprobadoPor ?? undefined,
  }
}

export async function fetchEgresos(token: string): Promise<EgresoRecord[]> {
  const data = await apiFetch<EgresoResponse[]>('/api/Egresos', undefined, token)
  return data.map(mapToRecord)
}

export async function aprobarEgreso(id: number, aprobadoPorId: number, token: string): Promise<void> {
  await apiFetch<void>(
    `/api/Egresos/${id}/aprobar`,
    { method: 'PATCH', body: JSON.stringify({ AprobadoPor: aprobadoPorId }) },
    token,
  )
}

export async function rechazarEgreso(id: number, token: string): Promise<void> {
  await apiFetch<void>(
    `/api/Egresos/${id}/rechazar`,
    { method: 'PATCH' },
    token,
  )
}
