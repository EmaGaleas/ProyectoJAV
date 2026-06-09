export interface Client {
  id:       string
  name:     string
  street:   string
  block:    string
  lot:      string
  initials: string
  dni:      string
}

export interface Payment {
  id:       string    // idVirtual ("mensualidad-5", "multa-3")
  idReal:   number    // idReal (int) para enviar al backend
  clientId: string
  concept:  string
  dueDate:  string    // YYYY-MM-DD (puede ser vacío si null)
  amount:   number
  mora:     number
  overdue:  boolean
  type:     'mensualidad' | 'multa'
}

export const CALLES  = ['Calle1A', 'Calle1B', 'Calle2A', 'Calle2B', 'Calle3A', 'Calle3B', 'Calle4A'] as const
export const BLOQUES = ['FGAD', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const

export const L       = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`
export const fmtDate = (d: string) => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${parseInt(day)}/${parseInt(m)}/${y}`
}
