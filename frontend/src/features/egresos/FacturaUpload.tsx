import { ACCEPTED_FILE_TYPES } from './types'

interface Props {
  file:     File | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FacturaUpload({ file, onChange }: Props) {
  return (
    <div
      className="bg-white rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-4 flex-1"
      data-name="frame-factura"
    >
      <label className="flex flex-col items-center justify-center w-full h-full min-h-[400px] rounded-[15px] bg-[#dbdbdb] hover:bg-[#cfd0d0] transition-colors cursor-pointer relative p-6">
        <input
          type="file"
          name="factura"
          accept={ACCEPTED_FILE_TYPES}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />

        {/* Ícono de subida */}
        <svg
          className="w-10 h-10 mb-4 text-[#514f4f] pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>

        <p className="font-medium text-[#514f4f] text-[18px] text-center max-w-[220px] pointer-events-none break-words leading-snug">
          {file ? file.name : 'Adjunta tu factura aquí'}
        </p>

        {!file && (
          <p className="text-[#9fa3a5] text-[13px] mt-2 pointer-events-none text-center">
            PDF, PNG, JPG · Máx. 5 MB
          </p>
        )}

        {file && (
          <span className="mt-3 text-[12px] text-[#8ebfa3] font-medium pointer-events-none">
            ✓ Archivo seleccionado
          </span>
        )}
      </label>
    </div>
  )
}
