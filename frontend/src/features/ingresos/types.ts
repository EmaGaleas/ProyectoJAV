export interface ClienteApi {
  idUsuario:      number
  nombreCompleto: string
  dni:            string
  calle:          string
  bloque:         string
  lote:           number
}

export interface DeudaItemApi {
  idReal:           number
  idVirtual:        string
  concepto:         string
  monto:            number
  fechaVencimiento: string | null
  estado:           string
  vencida:          boolean
  mora:             number
  tipo:             'mensualidad' | 'multa'
}

export interface RegistrarPagoPayload {
  registradoPor:      number
  metodoPago:         'Efectivo' | 'Transferencia'
  monto:              number
  selMensualidades:   DeudaItemApi[]
  selMultas:          DeudaItemApi[]
  comprobanteArchivo?: File | null
}
