import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import { obtenerDeudas } from '../services/ingresoService'
import { useAuthStore } from '../../auth/store/authStore'
import type { ClienteApi, DeudaItemApi } from '../types'
import { SectionLabel } from './shared'

const L       = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`
const fmtDate = (d: string | null) => {
  if (!d) return '—'
  const [y, m, day] = d.split('T')[0].split('-')
  return `${parseInt(day)}/${parseInt(m)}/${y}`
}

interface Props {
  client:              ClienteApi | null
  selMensualidades:    DeudaItemApi[]
  selMultas:           DeudaItemApi[]
  onToggleMensualidad: (item: DeudaItemApi) => void
  onToggleMulta:       (item: DeudaItemApi) => void
}

export function PendingPayments({ client, selMensualidades, selMultas, onToggleMensualidad, onToggleMulta }: Props) {
  const { token } = useAuthStore()

  const [mensualidades, setMensualidades] = useState<DeudaItemApi[]>([])
  const [multas,        setMultas]        = useState<DeudaItemApi[]>([])
  const [isLoading,     setIsLoading]     = useState(false)
  const [fetchError,    setFetchError]    = useState<string | null>(null)

  useEffect(() => {
    if (!client) { setMensualidades([]); setMultas([]); return }

    let cancelled = false
    setIsLoading(true)
    setFetchError(null)

    obtenerDeudas(client.idUsuario, token ?? '')
      .then(data => {
        if (!cancelled) {
          setMensualidades(data.mensualidades)
          setMultas(data.multas)
        }
      })
      .catch(() => { if (!cancelled) setFetchError('Error al cargar las deudas') })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [client, token])

  const sinDeudas = !isLoading && !fetchError && mensualidades.length === 0 && multas.length === 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)]">
      <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.06)]">
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>Mensualidades y Deudas</h2>
        <p style={{ fontSize: 12, color: client ? '#8EBFA3' : '#B0C8BA', marginTop: 2 }}>
          {client
            ? `${client.nombreCompleto} — ${client.calle}, Bloque ${client.bloque}, Lote ${client.lote}`
            : 'Selecciona un cliente para ver sus cuentas'}
        </p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {!client && (
          <div className="text-center py-8 flex flex-col items-center gap-2">
            <CalendarDays size={28} style={{ color: '#D5EDDF' }} />
            <span style={{ fontSize: 13, color: '#B0C8BA' }}>Selecciona un cliente para continuar</span>
          </div>
        )}

        {client && isLoading && (
          <p style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center', padding: '24px 0' }}>Cargando deudas...</p>
        )}

        {client && fetchError && !isLoading && (
          <p style={{ fontSize: 13, color: '#EF4444', textAlign: 'center', padding: '24px 0' }}>{fetchError}</p>
        )}

        {client && sinDeudas && (
          <p style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center', padding: '24px 0' }}>Sin cuentas pendientes</p>
        )}

        {mensualidades.length > 0 && (
          <PaymentGroup
            title="Mensualidades pendientes"
            items={mensualidades}
            selectedIds={selMensualidades.map(m => m.idReal)}
            onToggle={onToggleMensualidad}
          />
        )}

        {multas.length > 0 && (
          <PaymentGroup
            title="Multas"
            items={multas}
            selectedIds={selMultas.map(m => m.idReal)}
            onToggle={onToggleMulta}
          />
        )}
      </div>
    </div>
  )
}

function PaymentGroup({ title, items, selectedIds, onToggle }: {
  title:       string
  items:       DeudaItemApi[]
  selectedIds: number[]
  onToggle:    (item: DeudaItemApi) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SectionLabel text={title} />
        <span style={{ fontSize: 11, color: '#8EBFA3' }}>{items.length} ítem{items.length !== 1 ? 's' : ''}</span>
      </div>
      {items.map(p => (
        <PaymentRow
          key={p.idReal}
          item={p}
          selected={selectedIds.includes(p.idReal)}
          onToggle={() => onToggle(p)}
        />
      ))}
    </div>
  )
}

function PaymentRow({ item, selected, onToggle }: { item: DeudaItemApi; selected: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle}
      className="flex items-start gap-3 py-3 px-2 -mx-2 cursor-pointer hover:bg-[#F8FDFB] rounded-lg transition-colors"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>

      <div className="mt-0.5 shrink-0" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="w-4 h-4 rounded cursor-pointer accent-[#308C58]"
        />
      </div>

      <div className="flex-1 min-w-0">
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', display: 'block' }}>{item.concepto}</span>
        <span style={{ fontSize: 12, color: '#8EBFA3' }}>Vence: {fmtDate(item.fechaVencimiento)}</span>
        {item.vencida && (
          <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            Vencida
          </span>
        )}
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{L(item.monto)}</span>
        {item.mora > 0 && <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 500 }}>+{L(item.mora)} mora</span>}
      </div>
    </div>
  )
}
