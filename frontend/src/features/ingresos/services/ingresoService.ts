import { apiFetch } from '../../../services/apiClient'
import type { ClienteApi, DeudaItemApi } from '../types'

export async function buscarClientes(
  calle: string,
  bloque: string,
  token: string,
): Promise<ClienteApi[]> {
  const params = new URLSearchParams({ Calle: calle, Bloque: bloque })
  return apiFetch<ClienteApi[]>(`/api/clientes/buscar?${params}`, {}, token)
}

interface RawDeuda {
  idReal:           number
  concepto:         string
  monto:            number
  fechaVencimiento: string | null
  estado:           string
  vencida:          boolean
  mora:             number
}

interface DeudasResponse {
  mensualidades: DeudaItemApi[]
  multas:        DeudaItemApi[]
}

export async function obtenerDeudas(
  idUsuario: number,
  token: string,
): Promise<DeudasResponse> {
  const raw = await apiFetch<{ mensualidades: RawDeuda[]; multas: RawDeuda[] }>(
    `/api/deudas/usuario/${idUsuario}`, {}, token,
  )
  const map = (d: RawDeuda, tipo: 'mensualidad' | 'multa'): DeudaItemApi => ({
    idReal:           d.idReal,
    idVirtual:        `${tipo}-${d.idReal}`,
    concepto:         d.concepto,
    monto:            d.monto,
    fechaVencimiento: d.fechaVencimiento,
    estado:           d.estado,
    vencida:          d.vencida,
    mora:             d.mora,
    tipo,
  })
  return {
    mensualidades: raw.mensualidades.map(d => map(d, 'mensualidad')),
    multas:        raw.multas.map(d => map(d, 'multa')),
  }
}

export interface RegistrarPagoPayload {
  registradoPor:      number
  metodoPago:         'Efectivo' | 'Transferencia'
  monto:              number
  selMensualidades:   DeudaItemApi[]
  selMultas:          DeudaItemApi[]
  comprobanteArchivo?: File | null
}

export async function registrarPago(
  payload: RegistrarPagoPayload,
  token: string,
): Promise<void> {
  const fd = new FormData()
  fd.append('RegistradoPor',     String(payload.registradoPor))
  fd.append('MetodoPago',        payload.metodoPago)
  fd.append('Monto',             String(payload.monto))
  fd.append('CodigoComprobante', String(Date.now() % 1000000))

  payload.selMensualidades.forEach(m => fd.append('MensualidadesIds', String(m.idReal)))
  payload.selMultas.forEach(m        => fd.append('MultasIds',         String(m.idReal)))

  if (payload.comprobanteArchivo)
    fd.append('ComprobanteArchivo', payload.comprobanteArchivo)

  await apiFetch<void>('/api/pagos', { method: 'POST', body: fd }, token)
}
