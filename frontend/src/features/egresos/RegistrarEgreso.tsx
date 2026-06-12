import { useEgresoForm }    from './useEgresoForm'
import { EgresoFormFields } from './EgresoFormFields'
import { FacturaUpload }    from './FacturaUpload'

export default function RegistrarEgreso() {
  const {
    formData,
    registradoPor,
    isLoading,
    isFormComplete,

    handleFieldChange,
    handleFileChange,
    handleSubmit,
  } = useEgresoForm()

  return (
    <div className="bg-[#f2f2f2] w-11/12 p-6 md:p-10" data-name="Registrar Egresos">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row w-full gap-8 mx-auto">

        {/* ── Columna izquierda: campos del formulario ── */}
        <div
          className="bg-white rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex-1 w-full p-8 md:p-10"
          data-name="form-egreso"
        >
          <EgresoFormFields
            formData={formData}
            registradoPor={registradoPor}
            onFieldChange={handleFieldChange}
          />
        </div>

        {/* ── Columna derecha: factura + feedback + botón ── */}
        <div className="flex flex-col gap-4 w-full lg:w-[300px] shrink-0">
          <FacturaUpload file={formData.factura} onChange={handleFileChange} />

          

          {/* Botón — bloqueado hasta que todos los campos estén llenos */}
          <button
            type="submit"
            disabled={!isFormComplete || isLoading}
            className="h-[48px] w-full rounded-[15px] font-medium text-[#f2f2f2] text-[20px] flex items-center justify-center transition-colors shadow-sm"
            style={{
              background:     isFormComplete ? '#8ebfa3' : '#c8d8cf',
              cursor:         isFormComplete ? 'pointer' : 'not-allowed',
              opacity:        isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Registrando...' : 'Registrar Egreso'}
          </button>
        </div>

      </form>
    </div>
  )
}
