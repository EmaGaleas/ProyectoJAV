// ─── Entidades del dominio ────────────────────────────────────────────────────

export interface Client {
  id:       string
  name:     string
  street:   string   // "Calle1A", "Calle2B", etc.
  block:    string   // "A", "B", "C", etc.
  lot:      number   // LoteCasa es int en el back
  initials: string
  dni:      string
}

export interface Payment {
  id:       string   // compuesto: "{backId}-{type}" para uso interno del front
  clientId: string
  concept:  string
  dueDate:  string
  amount:   number
  mora:     number
  overdue:  boolean
  type:     'mensualidad' | 'multa' | 'conexion'
  backId:   number   // ID real del back para enviar en el POST
}

// ─── Calles y Bloques — valores exactos del enum del back ────────────────────

export const STREETS = [
  'Calle1A', 'Calle1B',
  'Calle2A', 'Calle2B',
  'Calle3A', 'Calle3B',
  'Calle4A',
]

export const BLOCKS_ALL = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'FGAD']

// Todos los bloques disponibles para cualquier calle
export const BLOCKS: Record<string, string[]> = Object.fromEntries(
  STREETS.map(s => [s, BLOCKS_ALL])
)

// Lotes como números (LoteCasa es int en el back)
export const MAX_LOTE = 20

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const L       = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`
export const fmtDate = (d: string) => { const [y, m, day] = d.split('-'); return `${parseInt(day)}/${parseInt(m)}/${y}` }

// Formatea el string del enum a display legible: "Calle1A" → "Calle 1A"
export const fmtCalle  = (c: string) => c.replace('Calle', 'Calle ')
export const fmtBloque = (b: string) => b === 'FGAD' ? 'Bloque FGAD' : `Bloque ${b}`