import { X, User, AlignLeft, MapPin, AlertCircle } from 'lucide-react'
import type { MultaRecord } from './types'
import { L, fmtDate } from './types'

// ─── Componente principal ─────────────────────────────────────────────────────

interface Props {
  record: MultaRecord
  onClose: () => void
}

export function MultaDetailModal({ record, onClose }: Props) {
  const direccionFormateada = `${record.ubicacion.street}, Bloque ${record.ubicacion.block}, Lote ${record.ubicacion.lot}`

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
              {/* Ícono de multa — cuadrado verde, documento con alerta */}
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{ width: 38, height: 38, background: '#308C58' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  <line x1="12" y1="12" x2="12" y2="16"></line>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#8EBFA3', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block' }}>
                  Detalle de la multa
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                  {record.codigoMulta}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MultaStatusBadge status={record.status} />
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

              {/* ── Sección 1: Infractor ── */}
              <InfoSection title="Infractor" icon={<User size={13} />}>
                <UniformGrid cols={2}>
                  <InfoField label="Persona multada" value={record.personaMultada} />
                  <InfoField label="DNI"             value={record.dni} />
                </UniformGrid>
              </InfoSection>
               {/* ── Sección 3: Ubicación ── */}
              <InfoSection title="Dirección del Infractor" icon={<MapPin size={13} />}>
                <InfoField label="Dirección" value={direccionFormateada} />
              </InfoSection>

              {/* ── Sección 2: Detalles de Infracción ── */}
              <InfoSection title="Detalles de la infracción" icon={<AlertCircle size={13} />}>
                <UniformGrid cols={2}>
                  <InfoField label="Fecha"         value={fmtDate(record.fecha)} />
                  <InfoField label="Monto"         value={L(record.monto)} highlight />
                  <InfoField label="Tipo de multa" value={record.tipoMulta} />
                </UniformGrid>
              </InfoSection>

             

              {/* ── Sección 4: Motivo ── */}
              <InfoSection title="Motivo de la multa" icon={<AlignLeft size={13} />}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A', lineHeight: 1.6, margin: 0 }}>
                  {record.motivo || '—'}
                </p>
              </InfoSection>

            </div>
          </div>

          {/* Sin Footer de acciones (Las multas no se aprueban ni rechazan aquí) */}
        </div>
      </div>
    </>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

/** Badge de estado con semántica de color. */
function MultaStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Aprobado':  { bg: '#e6f3ec', color: '#308C58' },
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