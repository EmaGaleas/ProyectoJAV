import { useState } from 'react'
import type { Income } from './types'
import { L, fmtDate } from './types'
import { InvoiceDetail } from './InvoiceDetail'
import { ConfirmDialog } from '../egresos/ConfirmDialog'

type Action = 'aprobar' | 'rechazar' | null

interface Props {
  income:    Income
  userRole:  string
  onClose:   () => void
  onApprove: (id: string) => Promise<void>
  onReject:  (id: string) => Promise<void>
}

export function IncomeDetailModal({ income, userRole, onClose, onApprove, onReject }: Props) {
  const [showInvoice,   setShowInvoice]   = useState(false)
  const [pendingAction, setPendingAction] = useState<Action>(null)
  const [isLoading,     setIsLoading]     = useState(false)

  const canAct = userRole === 'SuperAdministrador' && income.status === 'En revisión'

  const handleConfirm = async () => {
    if (!pendingAction) return
    setIsLoading(true)
    try {
      if (pendingAction === 'aprobar') await onApprove(income.id)
      else                             await onReject(income.id)
      setPendingAction(null)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
      >
        {/* Panel */}
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
                  {income.receiptNumber}
                </span>
              </div>
            </div>

            {/* Badge de estado */}
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={
                  income.status === 'Procesado'   ? { background: '#e6f3ec', color: '#308C58' } :
                  income.status === 'Rechazado'   ? { background: '#fde8e8', color: '#c0392b' } :
                                                    { background: '#fef9e7', color: '#b7791f' }
                }
              >
                {income.status}
              </span>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-xl hover:bg-[#F0FAF4] transition-colors"
                style={{ width: 32, height: 32, fontSize: 20, color: '#8EBFA3', fontWeight: 300 }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Cuerpo con scroll */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            {showInvoice ? (
              <InvoiceDetail
                income={income}
                onBack={() => setShowInvoice(false)}
                onApprove={async () => setPendingAction('aprobar')}
                onReject={async () => setPendingAction('rechazar')}
              />
            ) : (
              <IncomeDetail income={income} onViewInvoice={() => setShowInvoice(true)} />
            )}
          </div>

          {/* Footer — botones de acción */}
          {canAct && !showInvoice && (
            <div className="px-6 py-5 border-t border-[rgba(0,0,0,0.06)] flex gap-3">
              <button
                onClick={() => setPendingAction('rechazar')}
                className="flex-1 h-[44px] rounded-[10px] text-sm font-medium transition-colors"
                style={{ background: '#fde8e8', color: '#c0392b', border: 'none', cursor: 'pointer' }}
              >
                Rechazar ingreso
              </button>
              <button
                onClick={() => setPendingAction('aprobar')}
                className="flex-1 h-[44px] rounded-[10px] text-sm font-medium transition-colors"
                style={{ background: '#308C58', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Aprobar ingreso
              </button>
            </div>
          )}
        </div>
      </div>

      {pendingAction === 'aprobar' && (
        <ConfirmDialog
          title="Aprobar ingreso"
          message="¿Está seguro de que desea aprobar este ingreso? Esta acción no se puede deshacer."
          confirmLabel={isLoading ? 'Aprobando...' : 'Sí, aprobar'}
          confirmStyle="green"
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
          isLoading={isLoading}
        />
      )}

      {pendingAction === 'rechazar' && (
        <ConfirmDialog
          title="Rechazar ingreso"
          message="¿Está seguro de que desea rechazar este ingreso? Esta acción no se puede deshacer."
          confirmLabel={isLoading ? 'Rechazando...' : 'Sí, rechazar'}
          confirmStyle="red"
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

// ─── Vista de detalle ─────────────────────────────────────────────────────────

function IncomeDetail({ income, onViewInvoice }: { income: Income; onViewInvoice: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <DetailSection title="Titular de la cuenta">
        <DetailRow label="Nombre"         value={income.holderName} />
        <DetailRow label="DNI"            value={income.dni} />
        <DetailRow label="N° Comprobante" value={income.receiptNumber} />
      </DetailSection>

      {/* Dirección — solo si tiene datos */}
      {(income.street || income.block || income.lot) && (
        <DetailSection title="Dirección">
          <div className="grid grid-cols-3 gap-3">
            <AddressField label="Calle"  value={income.street} />
            <AddressField label="Bloque" value={income.block}  />
            <AddressField label="Lote"   value={income.lot}    />
          </div>
        </DetailSection>
      )}

      <DetailSection title="Información de pago">
        <DetailRow label="Método"  value={income.payMethod} />
        {income.transferCode && <DetailRow label="Comprobante" value={income.transferCode} />}
        <DetailRow label="Fecha"   value={fmtDate(income.date)} />
        <DetailRow label="Tipo"    value={income.paymentType} />
        <DetailRow label="Estado"  value={income.status} />
      </DetailSection>

      <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#F0FAF4', border: '1px solid #D5EDDF' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Monto Total</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#308C58' }}>{L(income.total)}</span>
      </div>

      {/* CTA factura — solo si tiene líneas */}
      {income.lines.length > 0 && (
        <button
          onClick={onViewInvoice}
          className="w-full py-3 rounded-xl transition-colors"
          style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
        >
          Ver Factura
        </button>
      )}
    </div>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

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
        <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500 }}>{value || '—'}</span>
      </div>
    </div>
  )
}