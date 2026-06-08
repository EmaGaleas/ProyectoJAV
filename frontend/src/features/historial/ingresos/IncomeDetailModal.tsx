import { useState, useEffect } from 'react'
import { fetchDetalleIngreso } from './services/historialService'
import type { IngresoApi, DetalleIngresoApi } from './services/historialService'
import { useAuthStore } from '../../auth/store/authStore'

const L       = (n: number) => `L ${n.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = (d: string) => {
  const date = new Date(d)
  return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`
}

interface Props {
  income:  IngresoApi
  onClose: () => void
}

export function IncomeDetailModal({ income, onClose }: Props) {
  const { token } = useAuthStore()

  const [detalle,   setDetalle]   = useState<DetalleIngresoApi | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setLoadError(null)

    fetchDetalleIngreso(income.idPago, token ?? '')
      .then(data  => { if (!cancelled) setDetalle(data) })
      .catch(()   => { if (!cancelled) setLoadError('No se pudo cargar el detalle') })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [income.idPago, token])

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
                Detalle de ingreso
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                {income.codigo}
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

        {/* Cuerpo con scroll */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <span style={{ fontSize: 13, color: '#8EBFA3' }}>Cargando detalle...</span>
            </div>
          )}

          {loadError && !isLoading && (
            <div className="flex items-center justify-center py-12">
              <span style={{ fontSize: 13, color: '#EF4444' }}>{loadError}</span>
            </div>
          )}

          {detalle && !isLoading && (
            <div className="flex flex-col gap-4">

              {/* Titular */}
              <DetailSection title="Titular de la cuenta">
                <DetailRow label="Nombre"         value={detalle.titular} />
                <DetailRow label="DNI"            value={detalle.dni} />
                <DetailRow label="N° Comprobante" value={detalle.numeroComprobante} />
              </DetailSection>

              {/* Dirección */}
              <DetailSection title="Dirección">
                <div className="grid grid-cols-3 gap-3">
                  <AddressField label="Calle"  value={detalle.calle} />
                  <AddressField label="Bloque" value={detalle.bloque} />
                  <AddressField label="Lote"   value={String(detalle.lote)} />
                </div>
              </DetailSection>

              {/* Pago */}
              <DetailSection title="Información de pago">
                <DetailRow label="Método" value={detalle.metodoPago} />
                {detalle.codigoTransferencia && (
                  <DetailRow label="Ref. Transferencia" value={detalle.codigoTransferencia} />
                )}
                <DetailRow label="Fecha"   value={fmtDate(detalle.fecha)} />
                <DetailRow label="Tipo"    value={detalle.tipoPago} />
                <DetailRow label="Estado"  value={detalle.estado} />
              </DetailSection>

              {/* Monto */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#F0FAF4', border: '1px solid #D5EDDF' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Monto Total</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#308C58' }}>{L(detalle.montoTotal)}</span>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
