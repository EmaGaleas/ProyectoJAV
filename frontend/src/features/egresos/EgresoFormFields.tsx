import type { EgresoFormData } from './types'

interface Props {
  formData:         EgresoFormData
  registradoPor:    string
  onFieldChange:    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const todayDisplay = () => {
  const d = new Date()
  return d.toLocaleDateString('es-HN', { day: '2-digit', month: 'long', year: 'numeric' })
}

// ─── Estilos compartidos ──────────────────────────────────────────────────────

const INPUT_BASE  = 'h-[52px] w-full border border-[#cfd3d4] rounded-[8px] px-[16px] py-[8px] text-[16px] text-[#514f4f] placeholder-[#abafb1] focus:outline-none focus:border-[#8ebfa3] focus:ring-1 focus:ring-[#8ebfa3]'
const INPUT_LOCK  = 'h-[52px] w-full border border-[#e8eaeb] rounded-[8px] px-[16px] py-[8px] text-[16px] bg-[#f7f8f8] text-[#9fa3a5] cursor-not-allowed select-none'
const LABEL_CLASS = "font-light text-[#514f4f] text-[18px] mb-2"

// ─── Componente ───────────────────────────────────────────────────────────────

export function EgresoFormFields({ formData, registradoPor, onFieldChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

      {/* Registrado Por — no editable, viene del auth */}
      <Field label="Registrado por:" colSpan>
        <div className={INPUT_LOCK}>{registradoPor}</div>
      </Field>

      {/* Descripción */}
      <Field label="Descripción:" colSpan>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={onFieldChange}
          placeholder="Describe a detalle el motivo del egreso"
          rows={3}
          required
          className="w-full border border-[#cfd3d4] rounded-[8px] px-[16px] py-[10px] text-[16px] text-[#514f4f] placeholder-[#abafb1] focus:outline-none focus:border-[#8ebfa3] focus:ring-1 focus:ring-[#8ebfa3] resize-none"
        />
      </Field>

      {/* Cliente */}
      <Field label="Receptor de Pago:" colSpan>
        <input
          type="text"
          name="cliente"
          value={formData.cliente}
          onChange={onFieldChange}
          placeholder="Ingrese nombre del contratista, cliente o proveedor"
          required
          className={INPUT_BASE}
        />
      </Field>

      {/* Fecha — no editable, siempre hoy */}
      <Field label="Fecha:">
        <div className={INPUT_LOCK}>{todayDisplay()}</div>
      </Field>

      {/* Monto en Lps */}
      <Field label="Monto (Lps):">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9fa3a5] text-[16px] pointer-events-none">
            L
          </span>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={onFieldChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
            className={`${INPUT_BASE} pl-[32px]`}
          />
        </div>
      </Field>

    </div>
  )
}

// ─── Sub-componente local ─────────────────────────────────────────────────────

function Field({ label, colSpan, children }: { label: string; colSpan?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col ${colSpan ? 'md:col-span-2' : ''}`}>
      <label className={LABEL_CLASS}>{label}</label>
      {children}
    </div>
  )
}
