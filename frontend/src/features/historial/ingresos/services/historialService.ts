import { apiFetch } from '../../../../services/apiClient'

export interface IngresoApi {
  idPago:      number
  codigo:      string
  tipoIngreso: string
  titular:     string
  dni:         string
  fecha:       string
  monto:       number
  estado:      string
}

export interface DetalleIngresoApi {
  titular:              string
  dni:                  string
  numeroComprobante:    string
  calle:                string
  bloque:               string
  lote:                 number
  metodoPago:           string
  codigoTransferencia?: string
  fecha:                string
  tipoPago:             string
  estado:               string
  montoTotal:           number
}

export async function fetchHistorialIngresos(token: string): Promise<IngresoApi[]> {
  return apiFetch<IngresoApi[]>('/api/pagos', {}, token)
}

export async function fetchDetalleIngreso(idPago: number, token: string): Promise<DetalleIngresoApi> {
  return apiFetch<DetalleIngresoApi>(`/api/pagos/${idPago}/detalle`, {}, token)
}
