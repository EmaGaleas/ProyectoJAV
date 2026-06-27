import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { CreditCard, Upload, FileText } from 'lucide-react'

export type Method = 'cash' | 'transfer'

interface Props {
  method: Method
  onMethodChange: (m: Method) => void
  code: string
  onCodeChange: (v: string) => void
  codeError: boolean
  file: File | null
  onFileChange: (f: File | null) => void
  fileError: boolean
}

export function PaymentMethodPanel({ 
  method, onMethodChange, code, onCodeChange, codeError, file, onFileChange, fileError 
}: Props) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const change = (m: Method) => { onMethodChange(m) }

  const labelTexto = method === 'cash' ? 'Número de recibo' : 'Número de comprobante'
  const placeholderTexto = method === 'cash' ? 'Ej. 00123' : 'Ej. 202500123'

  const handleNativeFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files?.[0] || null);
    e.target.value = ''; 
  };

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

      <div className="flex flex-col gap-1.5 mt-2">
        <label htmlFor="code" style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>
          {labelTexto} <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <input
          id="code"
          type="text"
          value={code}
          placeholder={placeholderTexto}
          // Solo admite números
          onChange={e => onCodeChange(e.target.value.replace(/\D/g, ''))} 
          className="h-9 px-3 text-sm rounded-xl border w-full focus:outline-none focus:ring-2 focus:ring-[#308C58] focus:ring-opacity-30"
          style={{ borderColor: codeError ? '#EF4444' : 'rgba(0,0,0,0.12)' }}
        />
        {codeError && <span style={{ fontSize: 11, color: '#EF4444' }}>Este campo es obligatorio</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>
          Adjuntar comprobante (Max 5MB)
        </label>

        <input type="file" ref={fileInputRef} accept="image/*,application/pdf" onChange={handleNativeFileChange} style={{ display: 'none' }} />

        <div className="flex gap-2">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 flex-1 h-10 px-3 rounded-xl border border-[rgba(0,0,0,0.1)] bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors cursor-pointer">
            <Upload size={16} color="#555" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>Subir archivo</span>
          </button>
        </div>

        <div className="flex items-center gap-2 h-9 px-3 rounded-xl border transition-all mt-1"
          style={{ 
            borderColor: file ? '#308C58' : (fileError ? '#EF4444' : 'rgba(0,0,0,0.12)'),
            backgroundColor: file ? '#F4FDF8' : '#fff'
          }}>
          {file ? (file.type === 'application/pdf' ? <FileText size={14} color="#308C58" /> : <Upload size={14} color="#308C58" />) : <Upload size={14} color="#888" />}
          <span style={{ fontSize: 12, color: file ? '#308C58' : '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: file ? 600 : 400 }}>
            {file ? file.name : 'Opcional...'}
          </span>
        </div>
      </div>
    </div>
  )
}

function RadioBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} type="button" className="flex items-center gap-2 flex-1 py-2 px-3 rounded-xl border transition-all cursor-pointer" style={{ borderColor: selected ? '#308C58' : 'rgba(0,0,0,0.1)', background: selected ? '#308C58' : '#F5F5F5' }}>
      <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 15, height: 15, border: `2px solid ${selected ? '#fff' : 'rgba(0,0,0,0.25)'}` }}>
        {selected && <div className="rounded-full" style={{ width: 6, height: 6, background: '#fff' }} />}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: selected ? '#fff' : '#555' }}>{label}</span>
    </button>
  )
}