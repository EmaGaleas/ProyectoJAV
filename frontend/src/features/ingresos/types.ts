// Tipos que representan exactamente las respuestas de la API

export interface ClienteAPI {
  idUsuario:      number
  nombreCompleto: string
  dni:            string
  calle:          string   // valor del enum, ej. "Calle1A"
  bloque:         string   // valor del enum, ej. "A"
  lote:           number
}

export interface DeudaItemAPI {
  idReal:          number
  idVirtual:       string   // "mensualidad-{id}" | "multa-{id}"
  concepto:        string
  monto:           number
  fechaVencimiento: string | null
  estado:          string
  vencida:         boolean
  mora:            number
}

export interface DeudasClienteAPI {
  mensualidades: DeudaItemAPI[]
  multas:        DeudaItemAPI[]
}

// Helpers de presentación
export const CALLE_LABEL: Record<string, string> = {
  Calle1A: 'Calle 1A', Calle1B: 'Calle 1B',
  Calle2A: 'Calle 2A', Calle2B: 'Calle 2B',
  Calle3A: 'Calle 3A', Calle3B: 'Calle 3B',
  Calle4A: 'Calle 4A',
}

export const BLOQUE_LABEL: Record<string, string> = {
  A: 'Bloque A', B: 'Bloque B', C: 'Bloque C', D: 'Bloque D',
  E: 'Bloque E', F: 'Bloque F', G: 'Bloque G', H: 'Bloque H',
  I: 'Bloque I', J: 'Bloque J', FGAD: 'Bloque FGAD',
}

export const L = (n: number) =>
  `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const fmtDate = (d: string | null) => {
  if (!d) return ''
  const [y, m, day] = d.split('T')[0].split('-')
  return `${parseInt(day)}/${parseInt(m)}/${y}`
}
