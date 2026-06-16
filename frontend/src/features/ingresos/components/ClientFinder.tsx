import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { STREETS, BLOCKS, BLOCKS_ALL, MAX_LOTE, fmtCalle, fmtBloque } from './types'
import type { Client } from './types'
import { Step, SectionLabel } from './shared'

const PER_PAGE = 3

interface Props {
  selectedClient: Client | null
  onSelectClient: (c: Client | null) => void
  // El lote es estrictamente un 'number' opcional, compatible con tu 'int' de C#
  fetchClients: (calle: string, bloque: string, lote?: number) => Promise<Client[]>;
}

export function ClientFinder({ selectedClient, onSelectClient, fetchClients }: Props) {
  const [street,  setStreet]  = useState('')
  const [block,   setBlock]   = useState('')
  const [lot,     setLot]     = useState<number | undefined>(undefined)
  const [page,    setPage]    = useState(0)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)

  const blocks  = street ? (BLOCKS[street] ?? BLOCKS_ALL) : []
  const pages   = Math.ceil(clients.length / PER_PAGE)
  const visible = clients.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const search = async (calle: string, bloque: string, lote?: number) => {
    if (!calle || !bloque) { setClients([]); return }
    setLoading(true)
    const result = await fetchClients(calle, bloque, lote)
    setClients(result)
    setPage(0)
    setLoading(false)
  }

  const onStreet = (v: string) => {
    setStreet(v); setBlock(''); setLot(undefined); setClients([]); onSelectClient(null)
  }
  
  const onBlock = (v: string) => {
    setBlock(v); setLot(undefined); onSelectClient(null); search(street, v)
  }
  
  const onLot = (v: string) => {
    // Transformamos el string del select al int que C# necesita
    const n = v ? parseInt(v, 10) : undefined;
    setLot(n); 
    setPage(0); 
    onSelectClient(null); 
    search(street, block, n);
  }
  
  const toggle = (c: Client) => onSelectClient(selectedClient?.id === c.id ? null : c)

  const selectClass = "w-full h-10 px-3 text-sm rounded-xl border border-[rgba(0,0,0,0.12)] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30 disabled:opacity-40 disabled:cursor-not-allowed"

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)]">
      <div className="px-6 pt-5 pb-4">
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>
          Ubicación y <span style={{ color: '#308C58' }}>Cliente</span>
        </h2>
      </div>

      <div className="px-6 pb-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MapPin size={13} style={{ color: '#308C58' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Filtro de dirección
          </span>
        </div>

        {/* Calle */}
        <div>
          <Step n={1} label="Calle" />
          <div className="relative">
            <select value={street} onChange={e => onStreet(e.target.value)} className={selectClass}>
              <option value="">Seleccionar calle</option>
              {STREETS.map(s => <option key={s} value={s}>{fmtCalle(s)}</option>)}
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Bloque */}
        <div>
          <Step n={2} label="Bloque" />
          <div className="relative">
            <select value={block} onChange={e => onBlock(e.target.value)} disabled={!street} className={selectClass}>
              <option value="">Seleccionar bloque</option>
              {blocks.map(b => <option key={b} value={b}>{fmtBloque(b)}</option>)}
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Lote */}
        <div>
          <Step n={3} label="Lote" />
          <div className="relative">
            <select
              value={lot ?? ''}
              onChange={e => onLot(e.target.value)}
              disabled={!block}
              className={selectClass}
            >
              <option value="">Todos los lotes</option>
              {Array.from({ length: MAX_LOTE }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>Lote {n}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      {street && block && (
        <div className="border-t border-[rgba(0,0,0,0.06)] px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel text="Clientes encontrados" />
            {pages > 1 && (
              <div className="flex items-center gap-1">
                <NavBtn onClick={() => setPage(p => p - 1)} disabled={page === 0}><ChevronLeft size={14} /></NavBtn>
                <span style={{ fontSize: 11, color: '#555' }}>{page + 1}/{pages}</span>
                <NavBtn onClick={() => setPage(p => p + 1)} disabled={page === pages - 1}><ChevronRight size={14} /></NavBtn>
              </div>
            )}
          </div>

          {loading ? (
            <p style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center' }}>Cargando clientes...</p>
          ) : clients.length === 0 ? (
            <p style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center' }}>Sin clientes para esta ubicación</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: PER_PAGE }).map((_, i) => {
                const c = visible[i]
                return c
                  ? <ClientCard key={c.id} c={c} selected={selectedClient?.id === c.id} onClick={() => toggle(c)} />
                  : <div key={`e${i}`} className="rounded-xl border-2 border-dashed border-[rgba(0,0,0,0.06)]" style={{ minHeight: 110 }} />
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ChevronDown() {
  return (
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 5L7 9L11 5" stroke="#8EBFA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function NavBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#F0FAF4] disabled:opacity-30 transition-colors"
      style={{ color: '#308C58' }}>
      {children}
    </button>
  )
}

function ClientCard({ c, selected, onClick }: { c: Client; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all w-full cursor-pointer"
      style={{ borderColor: selected ? '#308C58' : 'rgba(0,0,0,0.08)', background: selected ? '#F0FAF4' : '#FAFAFA' }}>
      {selected && (
        <div className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-full"
          style={{ width: 16, height: 16, background: '#308C58' }}>
          <svg width="9" height="9" viewBox="0 0 9 9">
            <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div className="flex items-center justify-center rounded-full"
        style={{ width: 40, height: 40, background: selected ? '#308C58' : '#D5EDDF', color: selected ? '#fff' : '#308C58', fontSize: 14, fontWeight: 700 }}>
        {c.initials}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3 }}>{c.name}</span>
      <span style={{ fontSize: 11, color: '#8EBFA3' }}>Lote {c.lot}</span>
    </button>
  )
}