import { CreditCard } from 'lucide-react'

export type Method = 'cash' | 'transfer'

interface Props {
  method: Method
  onMethodChange: (m: Method) => void
  code: string
  onCodeChange: (v: string) => void
  codeError: boolean
  file: File | null
  onFileChange: (f: File | null) => void
}

export function PaymentMethodPanel({ method, onMethodChange, code, onCodeChange, codeError, file, onFileChange }: Props) {
  const change = (m: Method) => { onMethodChange(m); if (m === 'cash') onCodeChange('') }

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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="code" style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>
              Número de comprobante <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="code"
              type="number"
              min="0"
              value={code}
              placeholder="Ej. 20250400123"
              onChange={e => onCodeChange(e.target.value)}
              className="h-9 px-3 text-sm rounded-xl border w-full focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30"
              style={{ borderColor: codeError ? '#EF4444' : 'rgba(0,0,0,0.12)' }}
            />
            {codeError && <span style={{ fontSize: 11, color: '#EF4444' }}>El comprobante es obligatorio</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>
              Captura del comprobante <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <label className="flex items-center gap-2 h-9 px-3 rounded-xl border border-dashed cursor-pointer hover:bg-[#F8FDFB] transition-colors"
              style={{ borderColor: 'rgba(0,0,0,0.12)', fontSize: 12 }}>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={e => onFileChange(e.target.files?.[0] ?? null)}
              />
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 4l3-3 3 3M2 11h10" stroke="#8EBFA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: file ? '#308C58' : '#B0C8BA', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file ? file.name : 'Subir archivo…'}
              </span>
            </label>
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
