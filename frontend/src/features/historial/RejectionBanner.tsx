import { AlertCircle } from 'lucide-react'

interface Props {
  /** Texto del motiv o comentario de rechazo. Si es nulo se muestra un mensaje por defecto. */
  motivo?:      string | null
  title?:       string
}

export function RejectionBanner({
  motivo,
  title       = 'Motivo del rechazo',
}: Props) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl px-4 py-4"
      style={{
        background: '#FEF2F2',
        border:     '1.5px solid #FECACA',
      }}
    >
      {/* Encabezado */}
      <div className="flex items-center gap-2">
        <AlertCircle size={15} style={{ color: '#C0392B', flexShrink: 0 }} />
        <span
          style={{
            fontSize:      11,
            fontWeight:    700,
            color:         '#C0392B',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </span>
      </div>

      {/* Motivo */}
      <div className="flex flex-col gap-0.5 pl-5">
        <span
          style={{
            fontSize:      10,
            fontWeight:    600,
            color:         '#F87171',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
        </span>
        <p
          style={{
            fontSize:   13,
            fontWeight: 500,
            color:      '#7F1D1D',
            lineHeight: 1.55,
            margin:     0,
          }}
        >
          {motivo?.trim() || 'No se especificó un motivo de rechazo.'}
        </p>
      </div>
    </div>
  )
}