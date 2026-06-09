import { apiFetch } from '../../services/apiClient'
import type { Client, Payment } from './types'

// ─── Shapes de respuesta del backend ─────────────────────────────────────────

interface ClienteApiResponse {
  idUsuario:      number
  nombreCompleto: string
  dni:            string
  calle:          string
  bloque:         string
  lote:           number
}

interface DeudaDetalleApi {
  idReal:           number
  idVirtual:        string
  concepto:         string
  monto:            number
  fechaVencimiento?: string
  estado:           string
  vencida:          boolean
  mora:             number
}

interface DeudasUsuarioApi {
  mensualidades: DeudaDetalleApi[]
  multas:        DeudaDetalleApi[]
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function initials(name: string): string {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function mapCliente(r: ClienteApiResponse): Client {
  return {
    id:       String(r.idUsuario),
    name:     r.nombreCompleto,
    street:   r.calle,
    block:    r.bloque,
    lot:      String(r.lote),
    initials: initials(r.nombreCompleto),
    dni:      r.dni,
  }
}

function mapDeuda(d: DeudaDetalleApi, clientId: string, type: 'mensualidad' | 'multa'): Payment {
  return {
    id:       d.idVirtual,
    idReal:   d.idReal,
    clientId,
    concept:  d.concepto,
    dueDate:  d.fechaVencimiento ? d.fechaVencimiento.split('T')[0] : '',
    amount:   d.monto,
    mora:     d.mora,
    overdue:  d.vencida,
    type,
  }
}

// ─── API ─────────────────────────────────────────────────────────────────────

export async function buscarClientes(
  calle: string,
  bloque: string,
  lote: string,
  token: string,
): Promise<Client[]> {
  const params = new URLSearchParams()
  if (calle)  params.set('Calle',  calle)
  if (bloque) params.set('Bloque', bloque)
  if (lote)   params.set('Lote',   lote)
  const data = await apiFetch<ClienteApiResponse[]>(
    `/api/clientes/buscar?${params.toString()}`,
    undefined,
    token,
  )
  return data.map(mapCliente)
}

export async function fetchDeudas(idUsuario: string, token: string): Promise<Payment[]> {
  const data = await apiFetch<DeudasUsuarioApi>(
    `/api/deudas/usuario/${idUsuario}`,
    undefined,
    token,
  )
  const mensualidades = data.mensualidades.map(d => mapDeuda(d, idUsuario, 'mensualidad'))
  const multas        = data.multas.map(d => mapDeuda(d, idUsuario, 'multa'))
  return [...mensualidades, ...multas]
}

export async function registrarPago(
  registradoPor: number,
  metodoPago: 'Efectivo' | 'Transferencia',
  monto: number,
  codigoComprobante: number,
  mensualidadesIds: number[],
  multasIds: number[],
  comprobanteArchivo: File | null,
  token: string,
): Promise<void> {
  const fd = new FormData()
  fd.append('RegistradoPor',     String(registradoPor))
  fd.append('MetodoPago',        metodoPago)
  fd.append('Monto',             String(monto))
  fd.append('CodigoComprobante', String(codigoComprobante))
  mensualidadesIds.forEach(id => fd.append('MensualidadesIds', String(id)))
  multasIds.forEach(id => fd.append('MultasIds', String(id)))
  if (comprobanteArchivo) fd.append('ComprobanteArchivo', comprobanteArchivo)

  await apiFetch<void>('/api/Pagos', { method: 'POST', body: fd }, token)
}
