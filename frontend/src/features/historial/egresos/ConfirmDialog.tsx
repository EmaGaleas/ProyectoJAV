interface Props {
  title:       string
  message:     string
  confirmLabel: string
  confirmStyle?: 'green' | 'red'
  onConfirm:   () => void
  onCancel:    () => void
  isLoading:   boolean
}

export function ConfirmDialog({
  title, message, confirmLabel, confirmStyle = 'green',
  onConfirm, onCancel, isLoading,
}: Props) {
  const confirmBg = confirmStyle === 'red' ? '#c0392b' : '#308C58'
  const loadingBg = confirmStyle === 'red' ? '#e8c8c8' : '#c8d8cf'

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
          <p className="text-base font-semibold text-[#1f2937]">{title}</p>
          <p className="text-sm text-[#6b7280]">{message}</p>
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
              background: isLoading ? loadingBg : confirmBg,
              color:      '#fff',
              border:     'none',
              cursor:     isLoading ? 'not-allowed' : 'pointer',
              opacity:    isLoading ? 0.7 : 1,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
