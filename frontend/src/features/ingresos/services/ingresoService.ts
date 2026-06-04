import { apiFetch } from '../../../services/apiClient'
import type { ClienteAPI, DeudasClienteAPI } from '../types'

export async function buscarClientes(
  token: string,
  calle?: string,
  bloque?: string,
  lote?: number
): Promise<ClienteAPI[]> {
  const params = new URLSearchParams()
  if (calle)        params.set('Calle',  calle)
  if (bloque)       params.set('Bloque', bloque)
  if (lote != null) params.set('Lote',   String(lote))

  const query = params.toString() ? `?${params.toString()}` : ''
  return apiFetch<ClienteAPI[]>(`/api/clientes/buscar${query}`, {}, token)
}

export async function obtenerDeudas(
  token: string,
  idUsuario: number
): Promise<DeudasClienteAPI> {
  return apiFetch<DeudasClienteAPI>(`/api/deudas/usuario/${idUsuario}`, {}, token)
}

export async function registrarPago(
  token: string,
  form: {
    registradoPor:    number
    metodoPago:       number   // 0 = Efectivo, 1 = Transferencia
    monto:            number
    codigoComprobante: number
    comprobanteArchivo?: File
    mensualidadesIds: number[]
    multasIds:        number[]
    conexionesIds:    number[]
  }
): Promise<void> {
  const fd = new FormData()
  fd.append('RegistradoPor',     String(form.registradoPor))
  fd.append('MetodoPago',        String(form.metodoPago))
  fd.append('Monto',             String(form.monto))
  fd.append('CodigoComprobante', String(form.codigoComprobante))

  form.mensualidadesIds.forEach(id => fd.append('MensualidadesIds', String(id)))
  form.multasIds.forEach(id        => fd.append('MultasIds',         String(id)))
  form.conexionesIds.forEach(id    => fd.append('ConexionesIds',      String(id)))

  if (form.comprobanteArchivo)
    fd.append('ComprobanteArchivo', form.comprobanteArchivo)

  await apiFetch<void>('/api/pagos', { method: 'POST', body: fd }, token)
}
