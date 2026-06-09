import { CalendarDays } from 'lucide-react'
import type { Client, Payment } from '../types'
import { L, fmtDate } from '../types'
import { SectionLabel } from './shared'

interface Props {
  client: Client | null
  payments: Payment[]
  loading: boolean
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function PendingPayments({ client, payments, loading, selectedIds, onToggle }: Props) {
  const mensual = payments.filter(p => p.type === 'mensualidad')
  const multas  = payments.filter(p => p.type === 'multa')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)]">
      <div className="px-6 pt-5 pb-4 border-b border-[rgba(0,0,0,0.06)]">
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>Mensualidades y Deudas</h2>
        <p style={{ fontSize: 12, color: client ? '#8EBFA3' : '#B0C8BA', marginTop: 2 }}>
          {client ? `${client.name} — ${client.street}, ${client.block}, Lote ${client.lot}` : 'Selecciona un cliente para ver sus cuentas'}
        </p>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {!client && (
          <div className="text-center py-8 flex flex-col items-center gap-2">
            <CalendarDays size={28} style={{ color: '#D5EDDF' }} />
            <span style={{ fontSize: 13, color: '#B0C8BA' }}>Selecciona un cliente para continuar</span>
          </div>
        )}
        {client && loading && (
          <p style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center', padding: '24px 0' }}>Cargando deudas…</p>
        )}
        {client && !loading && payments.length === 0 && (
          <p style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center', padding: '24px 0' }}>Sin cuentas pendientes</p>
        )}
        {mensual.length > 0 && <PaymentGroup title="Mensualidades pendientes" items={mensual} selectedIds={selectedIds} onToggle={onToggle} />}
        {multas.length  > 0 && <PaymentGroup title="Multas"                   items={multas}  selectedIds={selectedIds} onToggle={onToggle} />}
      </div>
    </div>
  )
}

function PaymentGroup({ title, items, selectedIds, onToggle }: { title: string; items: Payment[]; selectedIds: string[]; onToggle: (id: string) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SectionLabel text={title} />
        <span style={{ fontSize: 11, color: '#8EBFA3' }}>{items.length} ítem{items.length !== 1 ? 's' : ''}</span>
      </div>
      {items.map(p => <PaymentRow key={p.id} p={p} selected={selectedIds.includes(p.id)} onToggle={() => onToggle(p.id)} />)}
    </div>
  )
}

function PaymentRow({ p, selected, onToggle }: { p: Payment; selected: boolean; onToggle: () => void }) {
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
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', display: 'block' }}>{p.concept}</span>
        <span style={{ fontSize: 12, color: '#8EBFA3' }}>Vence: {fmtDate(p.dueDate)}</span>
        {p.overdue && (
          <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            Vencida
          </span>
        )}
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{L(p.amount)}</span>
        {p.mora > 0 && <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 500 }}>+{L(p.mora)} mora</span>}
      </div>
    </div>
  )
}
