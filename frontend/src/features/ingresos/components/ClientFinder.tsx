import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { buscarClientes } from '../services/ingresoService'
import { useAuthStore } from '../../auth/store/authStore'
import type { ClienteApi } from '../types'
import { Step, SectionLabel } from './shared'

const CALLES  = ['Calle1A', 'Calle1B', 'Calle2A', 'Calle2B', 'Calle3A', 'Calle3B', 'Calle4A']
const BLOQUES = ['FGAD', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const PER_PAGE = 3

interface Props {
  selectedClient: ClienteApi | null
  onSelectClient: (c: ClienteApi | null) => void
}

function initials(nombre: string): string {
  return nombre.split(' ').slice(0, 2).map(p => p[0] ?? '').join('').toUpperCase()
}

export function ClientFinder({ selectedClient, onSelectClient }: Props) {
  const { token } = useAuthStore()

  const [calle,      setCalle]      = useState('')
  const [bloque,     setBloque]     = useState('')
  const [lote,       setLote]       = useState('')
  const [page,       setPage]       = useState(0)
  const [clientes,   setClientes]   = useState<ClienteApi[]>([])
  const [isLoading,  setIsLoading]  = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!calle || !bloque) { setClientes([]); return }

    let cancelled = false
    setIsLoading(true)
    setFetchError(null)

    buscarClientes(calle, bloque, token ?? '')
      .then(data => { if (!cancelled) setClientes(data) })
      .catch(() => { if (!cancelled) setFetchError('Error al buscar clientes') })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [calle, bloque, token])

  const filtered = lote
    ? clientes.filter(c => c.lote === parseInt(lote))
    : clientes

  const pages   = Math.ceil(filtered.length / PER_PAGE)
  const visible = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  const onCalle  = (v: string) => { setCalle(v); setBloque(''); setLote(''); setPage(0); onSelectClient(null) }
  const onBloque = (v: string) => { setBloque(v); setLote(''); setPage(0); onSelectClient(null) }
  const onLote   = (v: string) => { setLote(v); setPage(0); onSelectClient(null) }
  const toggle   = (c: ClienteApi) => onSelectClient(selectedClient?.idUsuario === c.idUsuario ? null : c)

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
            <select value={calle} onChange={e => onCalle(e.target.value)} className={selectClass}>
              <option value="">Seleccionar calle</option>
              {CALLES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Bloque */}
        <div>
          <Step n={2} label="Bloque" />
          <div className="relative">
            <select value={bloque} onChange={e => onBloque(e.target.value)} disabled={!calle} className={selectClass}>
              <option value="">Seleccionar bloque</option>
              {BLOQUES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Lote */}
        <div>
          <Step n={3} label="Lote (opcional)" />
          <input
            type="number"
            min={1}
            value={lote}
            onChange={e => onLote(e.target.value)}
            disabled={!bloque}
            placeholder="Todos los lotes"
            className={`${selectClass} appearance-auto`}
          />
        </div>
      </div>

      {/* Resultados */}
      {calle && bloque && (
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

          {isLoading && (
            <p style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center' }}>Buscando...</p>
          )}
          {fetchError && !isLoading && (
            <p style={{ fontSize: 13, color: '#EF4444', textAlign: 'center' }}>{fetchError}</p>
          )}
          {!isLoading && !fetchError && filtered.length === 0 && (
            <p style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center' }}>Sin clientes para esta ubicación</p>
          )}
          {!isLoading && !fetchError && filtered.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: PER_PAGE }).map((_, i) => {
                const c = visible[i]
                return c
                  ? <ClientCard key={c.idUsuario} c={c} selected={selectedClient?.idUsuario === c.idUsuario} onClick={() => toggle(c)} />
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

function ClientCard({ c, selected, onClick }: { c: ClienteApi; selected: boolean; onClick: () => void }) {
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
        {initials(c.nombreCompleto)}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3, textAlign: 'center' }}>{c.nombreCompleto}</span>
      <span style={{ fontSize: 11, color: '#8EBFA3' }}>Lote {c.lote}</span>
    </button>
  )
}
