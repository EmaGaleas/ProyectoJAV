import { useState } from 'react'
import type { EgresoRecord, UserRole } from './types'
import { L, fmtDate } from './types'
import { ConfirmDialog } from './ConfirmDialog'

type Action = 'aprobar' | 'rechazar' | null

interface FieldProps { label: string; value: string }
function Field({ label, value }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">{label}</span>
      <span className="text-sm text-[#1f2937]">{value}</span>
    </div>
  )
}

interface Props {
  record:    EgresoRecord
  userRole:  UserRole
  onClose:   () => void
  onApprove: (id: string) => Promise<void>
  onReject:  (id: string) => Promise<void>
}

export function EgresoDetailModal({ record, userRole, onClose, onApprove, onReject }: Props) {
  const [pendingAction, setPendingAction] = useState<Action>(null)
  const [isLoading,     setIsLoading]     = useState(false)

  const canAct = userRole === 'SuperAdministrador' && record.status === 'Pendiente'

  const getFullUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5209'
    return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
  }

  const fullFacturaUrl = record.facturaUrl ? getFullUrl(record.facturaUrl) : ''
  const isImage = fullFacturaUrl ? /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(fullFacturaUrl) : false
  const isPdf = fullFacturaUrl ? /\.pdf(\?.*)?$/i.test(fullFacturaUrl) : false

  const handleConfirm = async () => {
    if (!pendingAction) return
    setIsLoading(true)
    try {
      if (pendingAction === 'aprobar') await onApprove(record.id)
      else                             await onReject(record.id)
      setPendingAction(null)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-40"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-[15px] shadow-[0px_8px_24px_rgba(0,0,0,0.2)] flex flex-col w-[480px] max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header Modificado */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#e5e7eb]">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-semibold text-[#1f2937]">{record.codigoEgreso}</span>
                <span className="text-xs text-[#9ca3af]">Detalle del egreso</span>
              </div>
              
              {/* Status badge reposicionado aquí al lado derecho */}
              <div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={
                    record.status === 'Aprobado'  ? { background: '#e6f3ec', color: '#308C58' } :
                    record.status === 'Rechazado' ? { background: '#fde8e8', color: '#c0392b' } :
                                                    { background: '#fef9e7', color: '#b7791f' }
                  }
                >
                  {record.status}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#9ca3af] hover:text-[#374151] text-lg font-medium transition-colors shrink-0"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-6 px-8 py-6">
            {/* Se removió el bloque antiguo del Status Badge de esta sección */}

            {/* Fields grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Registrado por"  value={record.registradoPor} />
              <Field label="DNI"             value={record.dni} />
              <Field label="Fecha"           value={fmtDate(record.fecha)} />
              <Field label="Monto"           value={L(record.monto)} />
              <Field label="Receptor de pago" value={record.receptorPago} />
              {record.aprobadoPor  && <Field label="Aprobado por"  value={record.aprobadoPor} />}
              {record.rechazadoPor && <Field label="Rechazado por" value={record.rechazadoPor} />}
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Descripción</span>
              <p className="text-sm text-[#1f2937] leading-relaxed">{record.descripcion}</p>
            </div>

            {/* Archivo asociado */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Archivo asociado</span>
              {fullFacturaUrl ? (
                isImage ? (
                  <a href={fullFacturaUrl} target="_blank" rel="noopener noreferrer" className="block w-fit mt-1 hover:opacity-90 transition-opacity">
                    <img src={fullFacturaUrl} alt="Archivo asociado" className="w-32 h-32 object-cover rounded-[10px] border border-[#e5e7eb] shadow-sm" />
                  </a>
                ) : isPdf ? (
                  <div className="flex items-center gap-3 bg-[#f3f4f6] rounded-[10px] px-4 py-3 w-fit border border-[#e5e7eb]">
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
                        <a href={fullFacturaUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#308C58] hover:underline">
                          Ver archivo
                        </a>
                        <a href={fullFacturaUrl} download className="text-xs font-medium text-[#308C58] hover:underline">
                          Descargar
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <a
                    href={fullFacturaUrl}
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
                <span className="text-sm text-[#6b7280]">No hay archivo asociado</span>
              )}
            </div>
          </div>

          {/* Footer — solo Presidente ve los botones cuando el egreso está Pendiente */}
          {canAct && (
            <div className="px-8 py-5 border-t border-[#e5e7eb] flex gap-3">
              <button
                onClick={() => setPendingAction('rechazar')}
                className="flex-1 h-[44px] rounded-[10px] text-sm font-medium transition-colors"
                style={{ background: '#fde8e8', color: '#c0392b', border: 'none', cursor: 'pointer' }}
              >
                Rechazar egreso
              </button>
              <button
                onClick={() => setPendingAction('aprobar')}
                className="flex-1 h-[44px] rounded-[10px] text-sm font-medium transition-colors"
                style={{ background: '#308C58', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Aprobar egreso
              </button>
            </div>
          )}
        </div>
      </div>

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