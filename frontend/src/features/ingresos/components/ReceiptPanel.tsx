import { FileText, CheckCircle } from 'lucide-react'
import type { Client, Payment } from '../types'
import { L, fmtDate } from '../types'
import type { Method } from './PaymentMethodPanel'

interface Props {
  client: Client | null
  selectedPayments: Payment[]
  method: Method
  code: string
  submitting: boolean
  submitError: string | null
  submitSuccess: boolean
  onSubmit: () => void
  onReset: () => void
}

const today = () => {
  const d = new Date()
  const m = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  return `${d.getDate()} de ${m[d.getMonth()]} de ${d.getFullYear()}`
}

export function ReceiptPanel({ client, selectedPayments, method, code, submitting, submitError, submitSuccess, onSubmit, onReset }: Props) {
  const mensual = selectedPayments.filter(p => p.type === 'mensualidad')
  const multas  = selectedPayments.filter(p => p.type === 'multa')
  const total   = selectedPayments.reduce((a, p) => a + p.amount + p.mora, 0)
  const hasData = client && selectedPayments.length > 0

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] flex flex-col items-center justify-center gap-4 px-5 py-10">
        <CheckCircle size={40} style={{ color: '#308C58' }} />
        <div className="text-center flex flex-col gap-1">
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>Ingreso registrado</span>
          <span style={{ fontSize: 13, color: '#8EBFA3' }}>El pago fue procesado correctamente.</span>
        </div>
        <button
          onClick={onReset}
          className="mt-2 px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          style={{ background: '#308C58', color: '#fff', fontSize: 13, fontWeight: 600 }}
        >
          Nuevo registro
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] flex flex-col overflow-hidden">

      {/* Cabecera fija */}
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

      {/* Cuerpo con scroll */}
      <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
        {hasData ? (
          <div className="px-5 py-4 flex flex-col gap-4">

            {/* Cliente */}
            <div>
              <ReceiptLabel text="Cliente" />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', display: 'block' }}>{client.name}</span>
              <span style={{ fontSize: 12, color: '#8EBFA3' }}>Lote {client.lot}</span>
            </div>

            {mensual.length > 0 && <ReceiptGroup title="Mensualidades" items={mensual} />}
            {multas.length  > 0 && <ReceiptGroup title="Multas"         items={multas}  />}

            <div style={{ borderTop: '1.5px dashed rgba(0,0,0,0.1)' }} />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>TOTAL</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#308C58' }}>{L(total)}</span>
            </div>

            {/* Método */}
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

      {/* Botón de envío */}
      {hasData && (
        <div className="px-5 py-4 border-t border-[rgba(0,0,0,0.06)] flex flex-col gap-2 shrink-0">
          {submitError && (
            <span style={{ fontSize: 12, color: '#EF4444' }}>{submitError}</span>
          )}
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
          >
            {submitting ? 'Registrando…' : 'Registrar ingreso'}
          </button>
        </div>
      )}

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

function ReceiptGroup({ title, items }: { title: string; items: Payment[] }) {
  const subtotal = items.reduce((a, p) => a + p.amount + p.mora, 0)
  return (
    <div className="flex flex-col gap-1.5">
      <ReceiptLabel text={title} />
      {items.map(p => (
        <div key={p.id}>
          <div className="flex justify-between">
            <span style={{ fontSize: 12, color: '#1A1A1A' }}>{p.concept}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>{L(p.amount)}</span>
          </div>
          {p.mora > 0 && (
            <div className="flex justify-between">
              <span style={{ fontSize: 11, color: '#EF4444' }}>Mora ({fmtDate(p.dueDate)})</span>
              <span style={{ fontSize: 11, color: '#EF4444' }}>+{L(p.mora)}</span>
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
