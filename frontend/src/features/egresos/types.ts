export interface EgresoFormData {
  titulo:      string
  descripcion: string
  monto:       string
  factura:     File | null
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const ACCEPTED_FILE_TYPES = '.pdf,.png,.jpg,.jpeg'
