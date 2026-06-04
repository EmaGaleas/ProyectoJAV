// ─── Formulario (estado interno del componente) ───────────────────────────────

export interface EgresoFormData {
  cliente:      string
  descripcion:  string
  monto:        string
  factura:      File | null
}

// ─── Payload (lo que se envía a POST /api/Egresos) ───────────────────────────
// Comparte esta interfaz con el equipo de backend para alinear el contrato.

export interface EgresoPayload {
  Cliente:       string    // Nombre del beneficiario / proveedor
  Descripcion:   string    // Detalle del egreso
  Monto:         number    // Monto en Lempiras
  Fecha:         string    // ISO 8601 — generada automáticamente (hoy)
  RegistradoPor: string    // Nombre del usuario autenticado (read-only)
  FacturaUrl:    string    // Nombre del archivo adjunto (se sube por separado si aplica)
}

// ─── Constantes ───────────────────────────────────────────────────────────────

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  // 5 MB
export const ACCEPTED_FILE_TYPES = '.pdf,.png,.jpg,.jpeg'
