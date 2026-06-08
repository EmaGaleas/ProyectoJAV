import { CreditCard, Paperclip } from 'lucide-react'

export type Method = 'cash' | 'transfer'

interface Props {
  method:                Method
  onMethodChange:        (m: Method) => void
  code:                  string
  onCodeChange:          (v: string) => void
  codeError:             boolean
  transferFile:          File | null
  onTransferFileChange:  (f: File | null) => void
  fileError:             boolean
}

export function PaymentMethodPanel({
  method, onMethodChange,
  code, onCodeChange, codeError,
  transferFile, onTransferFileChange, fileError,
}: Props) {
  const change = (m: Method) => {
    onMethodChange(m)
    if (m === 'cash') { onCodeChange(''); onTransferFileChange(null) }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] px-5 py-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CreditCard size={14} style={{ color: '#308C58' }} />
        <div>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block' }}>Pago</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Método de pago</span>
        </div>
      </div>

      <div>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
          Tipo de pago
        </span>
        <div className="flex gap-2">
          <RadioBtn label="Efectivo"      selected={method === 'cash'}     onClick={() => change('cash')} />
          <RadioBtn label="Transferencia" selected={method === 'transfer'} onClick={() => change('transfer')} />
        </div>
      </div>

      {method === 'transfer' && (
        <>
          {/* Número de referencia */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="code" style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>
              Número de referencia
            </label>
            <input
              id="code"
              type="text"
              value={code}
              placeholder="Ej. TRF-2025-00123"
              onChange={e => onCodeChange(e.target.value)}
              className="h-9 px-3 text-sm rounded-xl border w-full focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30"
              style={{ borderColor: codeError ? '#EF4444' : 'rgba(0,0,0,0.12)' }}
            />
            {codeError && <span style={{ fontSize: 11, color: '#EF4444' }}>El número de referencia es obligatorio</span>}
          </div>

          {/* Comprobante de transferencia */}
          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>
              Comprobante <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <label
              className="flex items-center gap-2 h-9 px-3 rounded-xl border cursor-pointer transition-colors hover:bg-[#F0FAF4]"
              style={{ borderColor: fileError ? '#EF4444' : transferFile ? '#308C58' : 'rgba(0,0,0,0.12)', background: transferFile ? '#F0FAF4' : '#fff' }}
            >
              <Paperclip size={13} style={{ color: transferFile ? '#308C58' : '#8EBFA3', flexShrink: 0 }} />
              <span className="truncate" style={{ fontSize: 12, color: transferFile ? '#308C58' : '#B0C8BA' }}>
                {transferFile ? transferFile.name : 'Adjuntar imagen o PDF'}
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={e => onTransferFileChange(e.target.files?.[0] ?? null)}
              />
            </label>
            {fileError && <span style={{ fontSize: 11, color: '#EF4444' }}>El comprobante de transferencia es obligatorio</span>}
          </div>
        </>
      )}
    </div>
  )
}

function RadioBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 flex-1 py-2 px-3 rounded-xl border transition-all cursor-pointer"
      style={{ borderColor: selected ? '#308C58' : 'rgba(0,0,0,0.1)', background: selected ? '#308C58' : '#F5F5F5' }}>
      <div className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 15, height: 15, border: `2px solid ${selected ? '#fff' : 'rgba(0,0,0,0.25)'}` }}>
        {selected && <div className="rounded-full" style={{ width: 6, height: 6, background: '#fff' }} />}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: selected ? '#fff' : '#555' }}>{label}</span>
    </button>
  )
}
