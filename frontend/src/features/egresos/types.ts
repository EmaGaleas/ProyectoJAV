// ─── Formulario (estado interno del componente)

export interface EgresoFormData {
  cliente:     string
  descripcion: string
  monto:       string
  factura:     File | null
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  // 5 MB
export const ACCEPTED_FILE_TYPES = '.pdf,.png,.jpg,.jpeg'