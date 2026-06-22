import { useState } from 'react'
import { X, FileText, User, CreditCard, AlignLeft } from 'lucide-react'
import type { EgresoRecord, UserRole } from './types'
import { L, fmtDate } from './types'
import { ConfirmDialog } from './ConfirmDialog'
import { RejectionBanner } from '../RejectionBanner'

// ─── Tipos internos ───────────────────────────────────────────────────────────

type Action = 'aprobar' | 'rechazar' | null

interface Props {
  record:    EgresoRecord
  userRole:  UserRole
  onClose:   () => void
  onApprove: (id: string) => Promise<void>
  onReject:  (id: string, motivo: string) => Promise<void> 
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5209'

// ─── Componente principal ─────────────────────────────────────────────────────

export function EgresoDetailModal({ record, userRole, onClose, onApprove, onReject }: Props) {
  const [pendingAction, setPendingAction] = useState<Action>(null)
  const [isLoading,     setIsLoading]     = useState(false)

  const canAct      = userRole === 'SuperAdministrador' && record.status === 'Pendiente'
  const esRechazado = record.status === 'Rechazado'

  const motivoRechazo =
    (record as any).motivoRechazo ??
    (record as any).comentarioRechazo ??
    null

  const getFullUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${API_BASE.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
  }

  const fullFacturaUrl = record.facturaUrl ? getFullUrl(record.facturaUrl) : ''

const handleConfirm = async (obs?: string) => {
  if (!pendingAction) return
  setIsLoading(true)
  try {
    if (pendingAction === 'aprobar') {
        await onApprove(record.id)
    } else {
        await onReject(record.id, obs || '') 
    }
    setPendingAction(null)
    onClose()
  } finally {
    setIsLoading(false)
  }
}

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(3px)' }}
        onClick={onClose}
      >
        <div
          className="bg-white flex flex-col overflow-hidden"
          style={{
            width:     480,
            maxHeight: '88vh',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          }}
          onClick={e => e.stopPropagation()}
        >

          {/* ── Cabecera ── */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#F8FDFB' }}
          >
            <div className="flex items-center gap-3">
              {/* Ícono de egreso — cuadrado verde, salida con flecha */}
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{ width: 38, height: 38, background: '#308C58' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#8EBFA3', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
                  Detalle del egreso
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                  {record.codigoEgreso}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <EgresoStatusBadge status={record.status} />
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-xl transition-colors hover:bg-gray-100"
                style={{ width: 32, height: 32, color: '#8EBFA3', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* ── Cuerpo ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-5">

              {/* Banner de rechazo */}
              {esRechazado && (
                <RejectionBanner
                  title="Motivo del egreso rechazado"
                  motivo={motivoRechazo}
                />
              )}

              {/* ── Sección 1: Responsable ── */}
              <InfoSection title="Responsable del egreso" icon={<User size={13} />}>
                <UniformGrid cols={2}>
                  <InfoField label="Registrado por"   value={record.registradoPor} />
                  <InfoField label="DNI"              value={record.dni} />
                  <InfoField label="Receptor de pago" value={record.receptorPago} />
                  {record.aprobadoPor  && <InfoField label="Aprobado por"  value={record.aprobadoPor} />}
                  {record.rechazadoPor && <InfoField label="Rechazado por" value={record.rechazadoPor} />}
                </UniformGrid>
              </InfoSection>

              {/* ── Sección 2: Pago ── */}
              <InfoSection title="Información del pago" icon={<CreditCard size={13} />}>
                <UniformGrid cols={2}>
                  <InfoField label="Fecha"  value={fmtDate(record.fecha)} />
                  <InfoField label="Monto"  value={L(record.monto)} highlight />
                </UniformGrid>
              </InfoSection>

              {/* ── Sección 3: Descripción ── */}
              <InfoSection title="Descripción" icon={<AlignLeft size={13} />}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A', lineHeight: 1.6, margin: 0 }}>
                  {record.descripcion || '—'}
                </p>
              </InfoSection>

              {/* ── Sección 4: Archivo asociado ── */}
              <InfoSection title="Archivo asociado" icon={<FileText size={13} />}>
                <EgresoDocumentViewer url={fullFacturaUrl} />
              </InfoSection>

            </div>
          </div>

          {/* ── Footer con acciones ── */}
          {canAct && (
            <div
              className="px-6 py-4 flex gap-3 shrink-0"
              style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: '#FAFAFA' }}
            >
              <button
                onClick={() => setPendingAction('rechazar')}
                className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold transition-colors"
                style={{ background: '#fde8e8', color: '#c0392b', border: 'none', cursor: 'pointer' }}
              >
                Rechazar egreso
              </button>
              <button
                onClick={() => setPendingAction('aprobar')}
                className="flex-1 h-[42px] rounded-[10px] text-sm font-semibold transition-colors"
                style={{ background: '#308C58', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Aprobar egreso
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Diálogos de confirmación ── */}
      {pendingAction === 'aprobar' && (
        <ConfirmDialog
          title="Aprobar egreso"
          message="¿Está seguro de que desea aprobar este egreso? Esta acción no se puede deshacer."
          confirmLabel={isLoading ? 'Aprobando...' : 'Sí, aprobar'}
          confirmStyle="green"
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
          isLoading={isLoading}
        />
      )}
      {pendingAction === 'rechazar' && (
        <ConfirmDialog
          title="Rechazar egreso"
          message="¿Está seguro de que desea rechazar este egreso? Esta acción no se puede deshacer."
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

// ─── Sub-componentes ──────────────────────────────────────────────────────────

/** Badge de estado con semántica de color. */
function EgresoStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Aprobado':  { bg: '#e6f3ec', color: '#308C58' },
    'Rechazado': { bg: '#fde8e8', color: '#c0392b' },
    'Pendiente': { bg: '#fef9e7', color: '#b7791f' },
  }
  const s = map[status] ?? map['Pendiente']
  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  )
}

/** Contenedor de sección con ícono, título y card de fondo. */
function InfoSection({
  title,
  icon,
  children,
}: {
  title:    string
  icon:     React.ReactNode
  children: React.ReactNode
}) {
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

/** Campo etiqueta + valor. Resiliente a nulos. */
function InfoField({
  label,
  value,
  highlight,
}: {
  label:      string
  value?:     string | null
  highlight?: boolean
}) {
  const display = value?.trim() || '—'
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span style={{ fontSize: 10, fontWeight: 600, color: '#B0C8BA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span
        className="truncate"
        title={display !== '—' ? display : undefined}
        style={{ fontSize: 13, fontWeight: highlight ? 700 : 500, color: highlight ? '#308C58' : '#1A1A1A' }}
      >
        {display}
      </span>
    </div>
  )
}

/** Grid de columnas uniformes con minmax(0, 1fr). */
function UniformGrid({ cols, children }: { cols: 2 | 3; children: React.ReactNode }) {
  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap:                 12,
      }}
    >
      {children}
    </div>
  )
}
function EgresoDocumentViewer({ url }: { url: string }) {
  if (!url) return <span style={{ fontSize: 13, color: '#6b7280' }}>No hay archivo</span>;

  // Extraer la extensión de la URL (manejando posibles parámetros de consulta)
  const cleanUrl = url.split('?')[0];
  const extension = cleanUrl.split('.').pop()?.toLowerCase();

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '');
  const isPdf = extension === 'pdf';

  // Si es imagen, renderiza el preview
  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block w-fit hover:opacity-90 transition-opacity">
        <img
          src={url}
          alt="Archivo"
          className="object-cover"
          style={{ width: 96, height: 96, borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)' }}
          onError={(e) => (e.currentTarget.style.display = 'none')} // Oculta si la imagen falla
        />
      </a>
    );
  }

  // Si es PDF, renderiza el bloque dedicado
  if (isPdf) {
    return (
      <div
        className="flex items-center gap-3 w-fit"
        style={{ background: '#F3F4F6', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 40, height: 40, background: '#E5E7EB' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>Documento PDF</span>
          <div className="flex items-center gap-3 mt-1">
            <a href={url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, fontWeight: 500, color: '#308C58', textDecoration: 'none' }}
              className="hover:underline">
              Ver archivo
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 w-fit hover:underline"
      style={{ background: '#F3F4F6', color: '#374151', textDecoration: 'none', fontSize: 13, fontWeight: 500, borderRadius: 10, padding: '8px 14px' }}
    >
      <div style={{ width: 14, height: 14, borderRadius: 4, background: '#308C58', flexShrink: 0 }} />
      Ver archivo adjunto
    </a>
  );
}

 

