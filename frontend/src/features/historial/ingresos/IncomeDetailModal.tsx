import { useState } from 'react'
import type { IncomeDetail } from './types'
import { L, fmtDate } from './types'
import { InvoiceDetail } from './InvoiceDetail'

interface Props {
  receiptNumber: string
  detail:        IncomeDetail | null
  isLoading:     boolean
  onClose:       () => void
}

export function IncomeDetailModal({ receiptNumber, detail, isLoading, onClose }: Props) {
  const [showInvoice, setShowInvoice] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 560, maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(0,0,0,0.06)] shrink-0">
          <div className="flex items-center gap-3">
            <div style={{ width: 36, height: 36, background: '#308C58', borderRadius: 10 }} />
            <div>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block' }}>
                {showInvoice ? 'Factura' : 'Detalle de ingreso'}
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                {receiptNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl hover:bg-[#F0FAF4] transition-colors"
            style={{ width: 32, height: 32, fontSize: 20, color: '#8EBFA3', fontWeight: 300 }}
          >
            ×
          </button>
        </div>

        {/* Cuerpo */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {isLoading || !detail ? (
            <div className="flex items-center justify-center py-10">
              <span style={{ fontSize: 13, color: '#8EBFA3' }}>Cargando detalle…</span>
            </div>
          ) : showInvoice ? (
            <InvoiceDetail detail={detail} onBack={() => setShowInvoice(false)} />
          ) : (
            <IncomeDetailBody detail={detail} onViewInvoice={() => setShowInvoice(true)} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Vista de detalle ─────────────────────────────────────────────────────────

function IncomeDetailBody({ detail, onViewInvoice }: { detail: IncomeDetail; onViewInvoice: () => void }) {
  return (
    <div className="flex flex-col gap-4">

      <DetailSection title="Titular de la cuenta">
        <DetailRow label="Nombre"         value={detail.holderName} />
        <DetailRow label="DNI"            value={detail.dni} />
        <DetailRow label="N° Comprobante" value={detail.receiptNumber} />
      </DetailSection>

      <DetailSection title="Dirección">
        <div className="grid grid-cols-3 gap-3">
          <AddressField label="Calle"  value={detail.street} />
          <AddressField label="Bloque" value={detail.block}  />
          <AddressField label="Lote"   value={detail.lot}    />
        </div>
      </DetailSection>

      <DetailSection title="Información de pago">
        <DetailRow label="Método"      value={detail.payMethod} />
        {detail.transferCode && <DetailRow label="Comprobante" value={detail.transferCode} />}
        <DetailRow label="Fecha"       value={fmtDate(detail.date)} />
        <DetailRow label="Tipo"        value={detail.paymentType} />
        <DetailRow label="Estado"      value={detail.status} />
      </DetailSection>

      <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#F0FAF4', border: '1px solid #D5EDDF' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Monto Total</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#308C58' }}>{L(detail.total)}</span>
      </div>

      <button
        onClick={onViewInvoice}
        className="w-full py-3 rounded-xl transition-colors"
        style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
      >
        Ver Factura
      </button>
    </div>
  )
}

// ─── sub-componentes locales ──────────────────────────────────────────────────

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span style={{ fontSize: 11, fontWeight: 700, color: '#308C58', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {title}
      </span>
      <div className="p-4 rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] flex flex-col gap-2.5">
        {children}
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span style={{ fontSize: 12, color: '#8EBFA3' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function AddressField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <div className="px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white">
        <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500 }}>{value}</span>
      </div>
    </div>
  )
}
