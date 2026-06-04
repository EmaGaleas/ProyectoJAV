export type PaymentType  = 'Mensualidad' | 'Multa'
export type IncomeStatus = 'Procesado' | 'En revisión' | 'Rechazado'
export type PayMethod    = 'Efectivo' | 'Transferencia'

export interface InvoiceLine {
  id: string
  concept: string
  dueDate: string
  baseAmount: number
  mora: number
  type: 'mensualidad' | 'multa'
}

export interface Income {
  id: string
  receiptNumber: string
  holderName: string
  dni: string
  paymentType: PaymentType
  date: string
  total: number
  status: IncomeStatus
  payMethod: PayMethod
  transferCode?: string
  street: string
  block: string
  lot: string
  lines: InvoiceLine[]
}

export const MOCK_INCOMES: Income[] = [
  { id:'1',  receiptNumber:'C-01', holderName:'Sandro Fernandez',  dni:'0801-1985-12345', paymentType:'Mensualidad', date:'2024-04-25', total:550,  status:'Procesado',   payMethod:'Transferencia', transferCode:'TRF-2024-00041', street:'Calle 1', block:'Bloque A', lot:'Lote 2', lines:[{ id:'l1',  concept:'Febrero 2024',               dueDate:'2024-02-27', baseAmount:500, mora:50, type:'mensualidad' }] },
  { id:'2',  receiptNumber:'C-02', holderName:'Ema Castellanos',   dni:'0501-1990-67890', paymentType:'Mensualidad', date:'2024-03-13', total:1000, status:'En revisión',  payMethod:'Efectivo',      transferCode:undefined,        street:'Calle 2', block:'Bloque A', lot:'Lote 1', lines:[{ id:'l2',  concept:'Enero 2024',                 dueDate:'2024-01-31', baseAmount:500, mora:0,  type:'mensualidad' },{ id:'l3', concept:'Febrero 2024', dueDate:'2024-02-27', baseAmount:500, mora:0, type:'mensualidad' }] },
  { id:'3',  receiptNumber:'C-04', holderName:'Lorenzo Flores',    dni:'0101-1978-11223', paymentType:'Multa',       date:'2024-03-03', total:342,  status:'Procesado',   payMethod:'Efectivo',      transferCode:undefined,        street:'Calle 1', block:'Bloque B', lot:'Lote 1', lines:[{ id:'l4',  concept:'Infracción área común',      dueDate:'2024-02-15', baseAmount:200, mora:0,  type:'multa'       },{ id:'l5', concept:'Daño instalaciones', dueDate:'2024-03-01', baseAmount:142, mora:0, type:'multa' }] },
  { id:'4',  receiptNumber:'C-05', holderName:'Jose Abraham',      dni:'0301-1982-44556', paymentType:'Mensualidad', date:'2024-02-19', total:525,  status:'Rechazado',   payMethod:'Transferencia', transferCode:'TRF-2024-00019', street:'Calle 3', block:'Bloque A', lot:'Lote 1', lines:[{ id:'l6',  concept:'Diciembre 2023',              dueDate:'2023-12-31', baseAmount:500, mora:25, type:'mensualidad' }] },
  { id:'5',  receiptNumber:'C-06', holderName:'Ana Torres',        dni:'0701-1995-77889', paymentType:'Mensualidad', date:'2024-05-01', total:500,  status:'Procesado',   payMethod:'Efectivo',      transferCode:undefined,        street:'Calle 1', block:'Bloque A', lot:'Lote 3', lines:[{ id:'l7',  concept:'Abril 2024',                 dueDate:'2024-04-30', baseAmount:500, mora:0,  type:'mensualidad' }] },
  { id:'6',  receiptNumber:'C-07', holderName:'María López',       dni:'0201-1988-33445', paymentType:'Mensualidad', date:'2024-05-10', total:500,  status:'Procesado',   payMethod:'Efectivo',      transferCode:undefined,        street:'Calle 1', block:'Bloque A', lot:'Lote 2', lines:[{ id:'l8',  concept:'Abril 2024',                 dueDate:'2024-04-30', baseAmount:500, mora:0,  type:'mensualidad' }] },
  { id:'7',  receiptNumber:'C-08', holderName:'Carlos Mendoza',    dni:'0601-1975-99001', paymentType:'Multa',       date:'2024-04-18', total:150,  status:'En revisión',  payMethod:'Transferencia', transferCode:'TRF-2024-00055', street:'Calle 2', block:'Bloque B', lot:'Lote 1', lines:[{ id:'l9',  concept:'Ruido excesivo',             dueDate:'2024-04-10', baseAmount:150, mora:0,  type:'multa'       }] },
  { id:'8',  receiptNumber:'C-09', holderName:'Pedro Castillo',    dni:'0401-1980-22334', paymentType:'Mensualidad', date:'2024-03-28', total:575,  status:'Procesado',   payMethod:'Efectivo',      transferCode:undefined,        street:'Calle 1', block:'Bloque C', lot:'Lote 1', lines:[{ id:'l10', concept:'Enero 2024',                 dueDate:'2024-01-31', baseAmount:500, mora:75, type:'mensualidad' }] },
  { id:'9',  receiptNumber:'C-10', holderName:'Lucía Herrera',     dni:'0901-1993-55667', paymentType:'Mensualidad', date:'2024-05-15', total:1000, status:'Rechazado',   payMethod:'Transferencia', transferCode:'TRF-2024-00072', street:'Calle 2', block:'Bloque A', lot:'Lote 2', lines:[{ id:'l11', concept:'Marzo 2024',                 dueDate:'2024-03-31', baseAmount:500, mora:0,  type:'mensualidad' },{ id:'l12', concept:'Abril 2024', dueDate:'2024-04-30', baseAmount:500, mora:0, type:'mensualidad' }] },
  { id:'10', receiptNumber:'C-11', holderName:'Roberto Díaz',      dni:'1501-1970-88990', paymentType:'Multa',       date:'2024-04-05', total:300,  status:'Procesado',   payMethod:'Efectivo',      transferCode:undefined,        street:'Calle 3', block:'Bloque A', lot:'Lote 2', lines:[{ id:'l13', concept:'Uso indebido estacionamiento',dueDate:'2024-03-20', baseAmount:300, mora:0,  type:'multa'       }] },
  { id:'11', receiptNumber:'C-12', holderName:'Gabriela Ramos',    dni:'0801-1991-66778', paymentType:'Mensualidad', date:'2024-05-20', total:525,  status:'En revisión',  payMethod:'Transferencia', transferCode:'TRF-2024-00081', street:'Calle 1', block:'Bloque A', lot:'Lote 4', lines:[{ id:'l14', concept:'Marzo 2024',                 dueDate:'2024-03-31', baseAmount:500, mora:25, type:'mensualidad' }] },
  { id:'12', receiptNumber:'C-13', holderName:'Fernando Aguilar',  dni:'1001-1983-44321', paymentType:'Mensualidad', date:'2024-05-22', total:500,  status:'Procesado',   payMethod:'Efectivo',      transferCode:undefined,        street:'Calle 2', block:'Bloque B', lot:'Lote 2', lines:[{ id:'l15', concept:'Mayo 2024',                  dueDate:'2024-05-31', baseAmount:500, mora:0,  type:'mensualidad' }] },
]

// Valores únicos para filtros de dirección
export const UNIQUE_STREETS = [...new Set(MOCK_INCOMES.map(i => i.street))].sort()
export const UNIQUE_BLOCKS  = [...new Set(MOCK_INCOMES.map(i => i.block))].sort()
export const UNIQUE_LOTS    = [...new Set(MOCK_INCOMES.map(i => i.lot))].sort()

export const L = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
export const fmtDate = (d: string) => { const [y,m,day] = d.split('-'); return `${day}/${m}/${y}` }
