import { useState, useEffect } from 'react'
import axios from 'axios' 
import { X, CreditCard, MapPin, User, Loader2, FileText, ChevronRight } from 'lucide-react'
import { L, fmtDate } from './types'
import type { Income } from './types'
import { useAuthStore } from '../../auth/store/authStore'
import { ConfirmDialog } from '../egresos/ConfirmDialog'
import Ingreso from '../../../assets/icons/sidebar/tesorero/ingresos.svg?react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface LineaPago {
  concepto:         string
  fechaVencimiento: string | null
  montoBase:        number
  mora:             number
  tipo:             string
}

interface DetalleBackend {
  titular:             string
  dni:                 string
  numeroComprobante:   string
  calle:               string
  bloque:              string
  lote:                number
  metodoPago:          string
  codigoTransferencia?: string
  fecha:               string | null
  tipoPago:            string
  estado:              string
  montoTotal:          number
  lineas:              LineaPago[]
  documentoUrl?:       string | null 
}

interface Props {
  income:    Income | null
  userRole:  string
  onClose:   () => void
  onApprove: (id: string) => Promise<void>
  onReject:  (id: string) => Promise<void>
}

type PendingAction = 'aprobar' | 'rechazar' | null

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5209'

// ─── Componente principal ─────────────────────────────────────────────────────

export function IncomeDetailModal({ income, userRole, onClose, onApprove, onReject }: Props) {
  const { token } = useAuthStore()

  const [detail,        setDetail]        = useState<DetalleBackend | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [showInvoice,   setShowInvoice]   = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [isSubmitting,  setIsSubmitting]  = useState(false)

  useEffect(() => {
    if (!income) return
    setDetail(null)
    setLoading(true)
    setShowInvoice(false)
    
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

    axios.get<DetalleBackend>(`${API_URL}/api/Pagos/${income.id}/detalle`, config)
      .then(res => setDetail(res.data))
      .catch(err  => console.error('Error al cargar detalle del pago', err))
      .finally(()  => setLoading(false))
  }, [income, token])

  if (!income) return null

  const esTransferencia = detail?.metodoPago?.toLowerCase() === 'transferencia'

  // Mostrar botones si: es SuperAdmin Y (estado "En revisión" O es transferencia)
  const canAct =
    userRole === 'SuperAdministrador' &&
    (income.status === 'En revisión' || esTransferencia)

  const codigoDisplay = esTransferencia && detail?.codigoTransferencia
    ? detail.codigoTransferencia
    : detail?.numeroComprobante || income.receiptNumber

  const handleConfirm = async () => {
    if (!pendingAction) return
    setIsSubmitting(true)
    try {
      if (pendingAction === 'aprobar') await onApprove(income.id)
      else                             await onReject(income.id)
      setPendingAction(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Lógica para formatear la URL y detectar si es PDF
  const getFullUrl = (url?: string | null) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${API_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
  }

  const fullDocumentUrl = detail ? getFullUrl(detail.documentoUrl) : ''
  const isPdf = fullDocumentUrl ? /\.pdf(\?.*)?$/i.test(fullDocumentUrl) : false

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(3px)' }}
        onClick={onClose}
      >
        {/* ── Contenedor flex: modal principal + panel factura ── */}
        <div
          className="relative flex items-stretch"
          style={{ width: '100%', maxWidth: 920, height: '85vh', maxHeight: 700 }}
          onClick={e => e.stopPropagation()}
        >

          {/* MODAL PRINCIPAL
          */}
          <div
            className="bg-white flex flex-col overflow-hidden"
            style={{
              width: showInvoice ? '66.666%' : '100%',
              borderRadius: showInvoice ? '20px 0 0 20px' : 20,
              transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), border-radius 0.3s ease',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            }}
          >
            {/* Cabecera */}
            <div
              className="flex items-center justify-between px-6 py-4 shrink-0"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#F8FDFB' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: 38, height: 38, background: '#308C58' }}
                >
                  <Ingreso width={18} height={18} fill="#fff" />
                </div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#8EBFA3', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
                    Detalle de ingreso
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                    {income.receiptNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={income.status} />
                <button
                  onClick={onClose}
                  className="flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
                  style={{ width: 32, height: 32, color: '#8EBFA3' }}
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Cuerpo */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Loader2 size={30} className="animate-spin" style={{ color: '#308C58' }} />
                  <span style={{ fontSize: 13, color: '#8EBFA3', fontWeight: 500 }}>
                    Cargando información del pago...
                  </span>
                </div>
              ) : !detail ? (
                <div className="flex items-center justify-center h-full">
                  <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 500 }}>
                    No se pudo cargar el detalle de este pago.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-5">

                  {/* Sección 1: Titular */}
                  <InfoSection title="Titular de la cuenta" icon={<User size={13} />}>
                    <ThreeColGrid>
                      <InfoField label="Nombre completo" value={detail.titular} />
                      <InfoField label="DNI / Identidad"  value={detail.dni} />
                      <InfoField label="N° Comprobante" value={codigoDisplay} highlight />
                    </ThreeColGrid>
                  </InfoSection>

                  {/* Sección 2: Dirección */}
                  <InfoSection title="Ubicación de la propiedad" icon={<MapPin size={13} />}>
                    <ThreeColGrid>
                      <InfoField label="Calle"  value={`${detail.calle}`} />
                      <InfoField label="Bloque" value={`Bloque ${detail.bloque}`} />
                      <InfoField label="Lote"   value={`Lote ${detail.lote}`} />
                    </ThreeColGrid>
                  </InfoSection>

                  {/* Sección 3: Pago */}
                  <InfoSection title="Información del pago" icon={<CreditCard size={13} />}>
                    <ThreeColGrid>
                      <InfoField label="Método de pago" value={detail.metodoPago} />
                      <InfoField label="Fecha de pago"  value={detail.fecha ? fmtDate(detail.fecha.split('T')[0]) : '—'} />
                      <InfoField label="Tipo de pago"   value={detail.tipoPago} />
                    </ThreeColGrid>
                    <ThreeColGrid>
                      <InfoField 
                        label="Estado" 
                        value={detail.estado === 'EnRevision' ? 'En Revisión' : detail.estado} 
                      />
                      {esTransferencia && detail.codigoTransferencia && (
                        <InfoField label="Comprobante de transferencia" value={detail.codigoTransferencia} highlight />
                      )}
                      <InfoField label="Registrado por"  value={'Pendiente'} />
                    </ThreeColGrid>
                  </InfoSection>

                  {/* Sección 4: Archivo adjunto */}
                  <InfoSection title="Documento de respaldo" icon={<FileText size={13} />}>
                    {fullDocumentUrl ? (
                      isPdf ? (
                        <div className="flex items-center gap-3 bg-[#FAFAFA] rounded-[10px] px-4 py-3 w-fit border border-[rgba(0,0,0,0.05)]">
                          <div className="w-10 h-10 rounded-lg bg-[#e5e7eb] flex items-center justify-center shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                          </div>
                          <div className="flex flex-col pr-2">
                            <span className="text-sm font-semibold text-[#1f2937]">Documento PDF</span>
                            <div className="flex items-center gap-3 mt-1">
                              <a href={fullDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#308C58] hover:underline">
                                Ver archivo
                              </a>
                              <a href={fullDocumentUrl} download className="text-xs font-medium text-[#308C58] hover:underline">
                                Descargar
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={fullDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium rounded-[10px] px-4 py-2 transition-colors w-fit"
                          style={{ background: '#f3f4f6', color: '#374151', textDecoration: 'none' }}
                        >
                          <div className="w-4 h-4 rounded bg-[#308C58] shrink-0" />
                          Ver archivo adjunto
                        </a>
                      )
                    ) : (
                      <span className="text-sm text-[#6b7280] px-1">No hay recibo asociado</span>
                    )}
                  </InfoSection>

                  {/* Total */}
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: '#F0FAF4', border: '1.5px solid #D5EDDF' }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Monto Total Recaudado</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#308C58' }}>{L(detail.montoTotal ?? 0)}</span>
                  </div>
                  
                  {/* CTA ver factura */}
                  {detail.lineas?.length > 0 && (
                    <button
                      onClick={() => setShowInvoice(v => !v)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors"
                      style={{
                        background: showInvoice ? '#F0FAF4' : '#308C58',
                        border: showInvoice ? '1.5px solid #D5EDDF' : 'none',
                        color: showInvoice ? '#308C58' : '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={15} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          {showInvoice ? 'Cerrar desglose de factura' : 'Ver desglose de factura'}
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        style={{ transform: showInvoice ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                      />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer con acciones */}
            {canAct && income.status!=="Procesado" && !loading && detail && (
              <div
                className="px-6 py-4 flex gap-3 shrink-0"
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: '#FAFAFA' }}
              >
                <button
                  onClick={() => setPendingAction('rechazar')}
                  className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold transition-colors"
                  style={{ background: '#fde8e8', color: '#c0392b', border: 'none', cursor: 'pointer' }}
                >
                  Rechazar ingreso
                </button>
                <button
                  onClick={() => setPendingAction('aprobar')}
                  className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold transition-colors"
                  style={{ background: '#308C58', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Aprobar ingreso
                </button>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════════
              PANEL LATERAL: DESGLOSE DE FACTURA (1/3 del ancho)
          ══════════════════════════════════════════════════════════════ */}
          <div
            style={{
              width: showInvoice ? '33.333%' : '0%',
              overflow: 'hidden',
              transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
              flexShrink: 0,
            }}
          >
            <div
              className="h-full flex flex-col"
              style={{
                width: '100%',
                minWidth: 280,
                background: '#fff',
                borderLeft: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '0 20px 20px 0',
                boxShadow: '4px 0 20px rgba(0,0,0,0.06) inset',
              }}
            >
              {/* Header del panel */}
              <div
                className="flex items-center justify-between px-4 py-4 shrink-0"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#F0FAF4' }}
              >
                <div className="flex items-center gap-2">
                  <FileText size={15} style={{ color: '#308C58' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>
                    Desglose de Factura
                  </span>
                </div>
                <button
                  onClick={() => setShowInvoice(false)}
                  className="rounded-lg hover:bg-white transition-colors p-1"
                  style={{ color: '#8EBFA3' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Líneas de factura con scroll */}
              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
                {detail?.lineas?.map((item, i) => (
                  <InvoiceLine key={i} item={item} />
                ))}
              </div>

              {/* Total del panel */}
              {detail && (
                <div
                  className="px-4 py-4 shrink-0"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: '#F8FDFB' }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#8EBFA3', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Total
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#308C58' }}>
                      {L(detail.montoTotal ?? 0)}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: '#B0C8BA', marginTop: 4 }}>
                    {detail.lineas?.length ?? 0} ítem{(detail.lineas?.length ?? 0) !== 1 ? 's' : ''} incluidos
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Diálogos de confirmación ── */}
      {pendingAction === 'aprobar' && (
        <ConfirmDialog
          title="Aprobar ingreso"
          message="¿Está seguro de que desea aprobar y procesar este ingreso? Esta acción no se puede deshacer."
          confirmLabel={isSubmitting ? 'Aprobando...' : 'Sí, aprobar'}
          confirmStyle="green"
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
          isLoading={isSubmitting}
        />
      )}
      {pendingAction === 'rechazar' && (
        <ConfirmDialog
          title="Rechazar ingreso"
          message="¿Está seguro de que desea rechazar este ingreso? El pago quedará invalidado permanentemente."
          confirmLabel={isSubmitting ? 'Rechazando...' : 'Sí, rechazar'}
          confirmStyle="red"
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
          isLoading={isSubmitting}
        />
      )}
    </>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    'Procesado':   { bg: '#e6f3ec', color: '#308C58' },
    'Rechazado':   { bg: '#fde8e8', color: '#c0392b' },
    'En revisión': { bg: '#fef9e7', color: '#b7791f' },
  }
  const s = styles[status] ?? styles['En revisión']
  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  )
}

function InfoSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span style={{ color: '#308C58' }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#308C58', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div
        className="flex flex-col gap-3 p-4 rounded-xl"
        style={{ background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.07)' }}
      >
        {children}
      </div>
    </div>
  )
}

function InfoField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span style={{ fontSize: 10, fontWeight: 600, color: '#B0C8BA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: highlight ? 700 : 500, color: highlight ? '#308C58' : '#1A1A1A' }}>
        {value || '—'}
      </span>
    </div>
  )
}

function ThreeColGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-3">{children}</div>
}

function InvoiceLine({ item }: { item: { concepto: string; montoBase: number; mora: number; tipo: string; fechaVencimiento: string | null } }) {
  const base = item.montoBase ?? 0
  const mora = item.mora ?? 0
  const subtotal = base + mora
  
  return (
    <div
      className="flex flex-col gap-1.5 p-3 rounded-xl"
      style={{ background: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3 }}>
            {item.concepto}
          </span>
          <span style={{ fontSize: 10, color: '#8EBFA3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.tipo}
          </span>
          {item.fechaVencimiento && (
            <span style={{ fontSize: 10, color: '#B0C8BA' }}>
              Vcto: {fmtDate(item.fechaVencimiento.split('T')[0])}
            </span>
          )}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap' }}>
          {L(subtotal)}
        </span>
      </div>
      {mora > 0 && (
        <div className="flex items-center justify-between pt-1.5" style={{ borderTop: '1px dashed rgba(0,0,0,0.08)' }}>
          <span style={{ fontSize: 10, color: '#8EBFA3' }}>Base: {L(base)}</span>
          <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 600 }}>+{L(mora)} mora</span>
        </div>
      )}
    </div>
  )
}