// AsignarMultaForm.tsx
import { X } from "lucide-react";
import { useAsignarMultaForm } from "./useAsignarMultaForm";
import { SearchableSelect } from "../SearchableSelect";
import { INPUT_CLS, LABEL_CLS, SECTION_TITLE_CLS } from "../types";
import type { TipoMulta } from "../types";


interface Props {
  onClose: () => void;
  onSuccess?: () => void;
  tiposMulta?: TipoMulta[];
  
}

const todayDisplay = () => {
  const d = new Date();
  return d.toLocaleDateString('es-HN', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function AsignarMultaForm({ onClose, onSuccess, tiposMulta = [] }: Props) {
  const {
    formData,
    setFormData,
    isLoading,
    dueñosDeCasa,
    
    handlePersonaSelect,
    handleTipoMultaSelect,
    handleSubmit
  } = useAsignarMultaForm(onClose, onSuccess);

  // 👇 NUEVA CONSTANTE (solo añadida aquí, no afecta el resto)
  const READONLY_INPUT_CLS = `${INPUT_CLS} bg-gray-50 text-gray-500 cursor-not-allowed font-bold`;

  // Mapear datos para los SearchableSelect asegurando la interfaz Option<T>
  const opcionesPersonas = dueñosDeCasa.map(u => ({
    label: u.nombre,
    value: u.id,
    data: u
  }));

  const opcionesTipos = tiposMulta
  .filter((t) => t.tipoDescripcion !== "Todos")
  .map((t) => ({
    label: t.tipoDescripcion,
    value: t.idMulta.toString(),
  }));

  return (
    <>
      <div className="fixed backdrop-blur-xs inset-0 z-40 bg-black/20" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full md:w-150 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 w-full flex z-40 px-4">
          <div className="w-full h-14 flex items-center max-w-125">
            <h2 className="text-gray-600 text-2xl font-light font-['Montserrat',sans-serif] pl-2">
              Asignar Multa
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <div className="flex justify-center w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-6 py-8 w-full max-w-125">
            
            {/* ── SECCIÓN: REGISTRO ── */}
            <div>
              <h3 className={SECTION_TITLE_CLS}>Registro</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLS}>Código de Multa</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    readOnly
                    className={READONLY_INPUT_CLS}  // ✅ usa la constante
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLS}>
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={todayDisplay()}    // ✅ cambió de div a input
                    readOnly
                    className={READONLY_INPUT_CLS}  // ✅ usa la misma constante
                  />
                </div>
              </div>
            </div>

            {/* ── SECCIÓN: INFRACTOR ── */}
            <div>
              <h3 className={SECTION_TITLE_CLS}>Infractor</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2 col-span-2">
                  <label className={LABEL_CLS}>Persona Multada <span className="text-red-500">*</span></label>
                  <SearchableSelect
                    options={opcionesPersonas}
                    value={formData.personaNombre}
                    onChange={(opt) => handlePersonaSelect({
                      value: opt.value,
                      label: opt.label,
                      data: opt.data!
                    })}
                    placeholder="Buscar dueño de casa..."
                    icon="search"
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-2">
                  <label className={LABEL_CLS}>DNI</label>
                  <input type="text" value={formData.dni} readOnly placeholder="Autocompletado" className={`${INPUT_CLS} bg-gray-50 cursor-not-allowed`} />
                </div>
              </div>
            </div>

            {/* ── SECCIÓN: DIRECCIÓN ── */}
            <div>
              <h3 className={SECTION_TITLE_CLS}>Dirección</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLS}>Calle</label>
                  <input type="text" value={formData.calle} readOnly placeholder="-" className={`${INPUT_CLS} bg-gray-50 cursor-not-allowed`} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLS}>Bloque</label>
                  <input type="text" value={formData.bloque} readOnly placeholder="-" className={`${INPUT_CLS} bg-gray-50 cursor-not-allowed`} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLS}>Lote</label>
                  <input type="text" value={formData.lote} readOnly placeholder="-" className={`${INPUT_CLS} bg-gray-50 cursor-not-allowed`} />
                </div>
              </div>
            </div>

            {/* ── SECCIÓN: MULTA Y MONTO ── */}
            <div>
              <h3 className={SECTION_TITLE_CLS}>Detalle de la Infracción</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLS}>Tipo de Multa <span className="text-red-500">*</span></label>
                  <SearchableSelect
                    options={opcionesTipos}
                    value={formData.tipoMulta}
                    onChange={(opt) => handleTipoMultaSelect({ value: opt.value, label: opt.label, monto: opt.data?.monto ?? 0 })}
                    placeholder="Buscar tipo..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={LABEL_CLS}>Monto (L)</label>
                  <input type="text" value={formData.monto} onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setFormData({ ...formData, monto: "" });
                    } else if (/^\d+$/.test(val)) {
                      setFormData({ ...formData, monto: parseInt(val, 10) });
                    }
                  }} placeholder="Ingrese el monto" className={`${INPUT_CLS} bg-gray-50 font-bold text-[#308C58] `} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className={LABEL_CLS}>Descripción <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Escriba el motivo detallado de la multa..."
                  className="w-full px-[16px] py-[10px] rounded-[10px] border-[#d1d5dc] border-[0.8px] font-['Arimo',sans-serif] text-[16px] text-[#514f4f] placeholder:text-[#abafb1] focus:outline-none focus:ring-2 focus:ring-[#308c58]/20 focus:border-[#308c58] resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="sticky bottom-0 bg-white pb-4 pt-2 mt-auto">
              <button
                type="submit"
                disabled={isLoading || !formData.personaId || !formData.tipoMulta}
                className="w-full h-[48px] bg-[#308c58] drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] rounded-[10px] font-['Arimo',sans-serif] font-normal text-[20px] text-white hover:bg-[#267045] transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Asignando Multa..." : "Asignar Multa"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}