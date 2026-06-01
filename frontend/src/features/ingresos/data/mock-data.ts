export interface Client { id: string; name: string; street: string; block: string; lot: string; initials: string }
export interface Payment { id: string; clientId: string; concept: string; dueDate: string; amount: number; mora: number; overdue: boolean; type: 'mensualidad' | 'multa' }

export const STREETS = ['Calle 1', 'Calle 2', 'Calle 3']
export const BLOCKS: Record<string, string[]> = { 'Calle 1': ['Bloque A','Bloque B','Bloque C'], 'Calle 2': ['Bloque A','Bloque B'], 'Calle 3': ['Bloque A'] }
export const LOTS: Record<string, string[]>   = { 'Bloque A': ['Lote 1','Lote 2','Lote 3','Lote 4'], 'Bloque B': ['Lote 1','Lote 2'], 'Bloque C': ['Lote 1'] }

export const CLIENTS: Client[] = [
  { id:'1', name:'Ana Torres',     street:'Calle 1', block:'Bloque A', lot:'Lote 3', initials:'AT' },
  { id:'2', name:'Carlos Mendoza', street:'Calle 1', block:'Bloque A', lot:'Lote 1', initials:'CM' },
  { id:'3', name:'María López',    street:'Calle 1', block:'Bloque A', lot:'Lote 2', initials:'ML' },
  { id:'4', name:'José Ramírez',   street:'Calle 1', block:'Bloque A', lot:'Lote 4', initials:'JR' },
  { id:'5', name:'Pedro Castillo', street:'Calle 1', block:'Bloque B', lot:'Lote 1', initials:'PC' },
  { id:'6', name:'Lucía Herrera',  street:'Calle 2', block:'Bloque A', lot:'Lote 1', initials:'LH' },
]

export const PAYMENTS: Payment[] = [
  { id:'p1', clientId:'1', concept:'Febrero 2024', dueDate:'2024-02-27', amount:500, mora:50,  overdue:true,  type:'mensualidad' },
  { id:'p2', clientId:'1', concept:'Marzo 2024',   dueDate:'2024-03-30', amount:500, mora:25,  overdue:true,  type:'mensualidad' },
  { id:'p3', clientId:'1', concept:'Abril 2024',   dueDate:'2024-04-30', amount:500, mora:0,   overdue:false, type:'mensualidad' },
  { id:'p4', clientId:'1', concept:'Infracción área común', dueDate:'2024-03-15', amount:200, mora:0, overdue:false, type:'multa' },
  { id:'p5', clientId:'2', concept:'Febrero 2024', dueDate:'2024-02-27', amount:500, mora:75,  overdue:true,  type:'mensualidad' },
  { id:'p6', clientId:'2', concept:'Marzo 2024',   dueDate:'2024-03-30', amount:500, mora:0,   overdue:false, type:'mensualidad' },
]

export const L = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`
export const fmtDate = (d: string) => { const [y,m,day]=d.split('-'); return `${parseInt(day)}/${parseInt(m)}/${y}` }
