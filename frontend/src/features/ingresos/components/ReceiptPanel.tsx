import { FileText } from 'lucide-react'
import type { ClienteAPI, DeudaItemAPI } from '../types'
import { L, fmtDate } from '../types'
import type { Method } from './PaymentMethodPanel'

interface Props {
  client:      ClienteAPI | null
  deudas:      DeudaItemAPI[]          // todas las deudas cargadas para el cliente
  selectedIds: string[]
  method:      Method
  code:        string
}

const today = () => {
  const d = new Date()
  const m = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  return `${d.getDate()} de ${m[d.getMonth()]} de ${d.getFullYear()}`
}

export function ReceiptPanel({ client, deudas, selectedIds, method, code }: Props) {
  const items   = deudas.filter(d => selectedIds.includes(d.idVirtual))
  const mensual = items.filter(d => d.idVirtual.startsWith('mensualidad-'))
  const multas  = items.filter(d => d.idVirtual.startsWith('multa-'))
  const total   = items.reduce((a, d) => a + d.monto + d.mora, 0)
  const hasData = client && items.length > 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] flex flex-col overflow-hidden">

      <div className="flex items-start justify-between px-5 py-4 border-b border-[rgba(0,0,0,0.06)] shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={14} style={{ color: '#308C58' }} />
          <div>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block' }}>Documento</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>Vista previa del recibo</span>
          </div>
        </div>
        <div className="text-right">
          <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block' }}>Fecha</span>
          <span style={{ fontSize: 11, color: '#1A1A1A', fontWeight: 500 }}>{today()}</span>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
        {hasData ? (
          <div className="px-5 py-4 flex flex-col gap-4">
            <div>
              <ReceiptLabel text="Cliente" />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', display: 'block' }}>{client.nombreCompleto}</span>
              <span style={{ fontSize: 12, color: '#8EBFA3' }}>Lote {client.lote}</span>
            </div>

            {mensual.length > 0 && <ReceiptGroup title="Mensualidades" items={mensual} />}
            {multas.length  > 0 && <ReceiptGroup title="Multas"         items={multas} />}

            <div style={{ borderTop: '1.5px dashed rgba(0,0,0,0.1)' }} />

            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>TOTAL</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#308C58' }}>{L(total)}</span>
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <ReceiptRow label="Método" value={method === 'cash' ? 'Efectivo' : 'Transferencia'} />
              {method === 'transfer' && code && <ReceiptRow label="Comprobante" value={code} />}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-2 px-5">
            <FileText size={32} style={{ color: '#D5EDDF' }} />
            <span style={{ fontSize: 13, color: '#B0C8BA', textAlign: 'center', lineHeight: 1.5 }}>
              {!client ? 'Selecciona un cliente' : 'Selecciona mensualidades para ver el resumen'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function ReceiptLabel({ text }: { text: string }) {
  return <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 3 }}>{text}</span>
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ fontSize: 12, color: '#8EBFA3' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function ReceiptGroup({ title, items }: { title: string; items: DeudaItemAPI[] }) {
  const subtotal = items.reduce((a, d) => a + d.monto + d.mora, 0)
  return (
    <div className="flex flex-col gap-1.5">
      <ReceiptLabel text={title} />
      {items.map(d => (
        <div key={d.idVirtual}>
          <div className="flex justify-between">
            <span style={{ fontSize: 12, color: '#1A1A1A' }}>{d.concepto}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>{L(d.monto)}</span>
          </div>
          {d.mora > 0 && (
            <div className="flex justify-between">
              <span style={{ fontSize: 11, color: '#EF4444' }}>Mora ({fmtDate(d.fechaVencimiento)})</span>
              <span style={{ fontSize: 11, color: '#EF4444' }}>+{L(d.mora)}</span>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-between pt-1">
        <span style={{ fontSize: 11, color: '#8EBFA3' }}>Subtotal</span>
        <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>{L(subtotal)}</span>
      </div>
    </div>
  )
}
