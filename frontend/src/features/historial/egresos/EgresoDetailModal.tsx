import { useState } from 'react'
import type { EgresoRecord, UserRole } from './types'
import { L, fmtDate } from './types'
import { ConfirmDialog } from './ConfirmDialog'
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
  record:       EgresoRecord
  userRole:     UserRole
  onClose:      () => void
  onApprove:    (id: string) => Promise<void>
}

export function EgresoDetailModal({ record, userRole, onClose, onApprove }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading,   setIsLoading]   = useState(false)

  const canApprove = userRole === 'Presidente' && record.status === 'Pendiente'

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await onApprove(record.id)
      setShowConfirm(false)
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
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#e5e7eb]">
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-semibold text-[#1f2937]">{record.codigoEgreso}</span>
              <span className="text-xs text-[#9ca3af]">Detalle del egreso</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#9ca3af] hover:text-[#374151] text-lg font-medium transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-6 px-8 py-6">
            {/* Status badge */}
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

            {/* Fields grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <Field label="Registrado por" value={record.registradoPor} />
              <Field label="DNI"            value={record.dni} />
              <Field label="Fecha"          value={fmtDate(record.fecha)} />
              <Field label="Monto"          value={L(record.monto)} />
              <Field label="Receptor de pago" value={record.receptorPago} />
              {record.aprobadoPor && (
                <Field label="Aprobado por" value={record.aprobadoPor} />
              )}
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Descripción</span>
              <p className="text-sm text-[#1f2937] leading-relaxed">{record.descripcion}</p>
            </div>

            {/* Archivo asociado */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Archivo asociado</span>
              <a
                href={record.facturaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium rounded-[10px] px-4 py-2 transition-colors w-fit"
                style={{ background: '#f3f4f6', color: '#374151', textDecoration: 'none' }}
              >
                <div className="w-4 h-4 rounded bg-[#308C58] shrink-0" />
                {record.facturaUrl}
              </a>
            </div>
          </div>

          {/* Footer — admin approve button */}
          {canApprove && (
            <div className="px-8 py-5 border-t border-[#e5e7eb]">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full h-[44px] rounded-[10px] text-sm font-medium transition-colors"
                style={{ background: '#308C58', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Aprobar egreso
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          onConfirm={handleApprove}
          onCancel={() => setShowConfirm(false)}
          isLoading={isLoading}
        />
      )}
    </>
  )
}
