interface Props {
  onConfirm: () => void
  onCancel:  () => void
  isLoading: boolean
}

export function ConfirmDialog({ onConfirm, onCancel, isLoading }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[15px] shadow-[0px_8px_24px_rgba(0,0,0,0.2)] p-8 flex flex-col gap-6 w-[360px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-[#1f2937]">Aprobar egreso</p>
          <p className="text-sm text-[#6b7280]">
            ¿Está seguro de que desea aprobar este egreso? Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2 rounded-[10px] text-sm font-medium transition-colors"
            style={{ background: '#f3f4f6', color: '#374151', border: 'none', cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 rounded-[10px] text-sm font-medium transition-colors"
            style={{
              background: isLoading ? '#c8d8cf' : '#308C58',
              color:      '#fff',
              border:     'none',
              cursor:     isLoading ? 'not-allowed' : 'pointer',
              opacity:    isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Aprobando...' : 'Sí, aprobar'}
          </button>
        </div>
      </div>
    </div>
  )
}
