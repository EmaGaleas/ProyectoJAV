import { ChevronRight } from "lucide-react";
import type { CreateUserFormData } from "./types";
import { CALLES, BLOQUES, INPUT_CLS, LABEL_CLS, SECTION_TITLE_CLS, SELECT_CLS } from "./types";


interface Props {
  formData: CreateUserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTipoViviendaChange: (tipo: string) => void;
  onCasaHabilitadaChange: (value: boolean) => void;
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className={LABEL_CLS}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={SELECT_CLS}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronRight
          size={20}
          className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-[#514f4f]"
        />
      </div>
    </div>
  );
}

export function SeccionDireccion({
  formData,
  onChange,
  onTipoViviendaChange,
  onCasaHabilitadaChange,
}: Props) {
  const tieneApts =
    formData.tipoVivienda === "Apartamentos" || formData.tipoVivienda === "Ambos";
  const tieneCasa =
    formData.tipoVivienda === "Casa" || formData.tipoVivienda === "Ambos";

  return (
    <div>
      <h3 className={SECTION_TITLE_CLS}>Dirección</h3>

      {/* Calle + Bloque lado a lado */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <SelectField
          label="Calle"
          name="calle"
          value={formData.calle}
          onChange={onChange}
          options={CALLES}
          placeholder="Selecciona una calle"
          required
        />
        <SelectField
          label="Bloque"
          name="bloque"
          value={formData.bloque}
          onChange={onChange}
          options={BLOQUES}
          placeholder="Selecciona un bloque"
          required
        />
      </div>

      {/* # de Lote + Tipo de Vivienda lado a lado */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLS}>
            # de Lote <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="numerolote"
            value={formData.numerolote}
            onChange={onChange}
            placeholder="Ej: 15"
            min="1"
            step="1"
            required
            className={INPUT_CLS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLS}>
            Tipo de Vivienda <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="tipoVivienda"
              value={formData.tipoVivienda}
              onChange={(e) => onTipoViviendaChange(e.target.value)}
              required
              className={SELECT_CLS}
            >
              <option value="Casa">Casa</option>
              <option value="Apartamentos">Apartamentos</option>
              <option value="Ambos">Ambos</option>
            </select>
            <ChevronRight
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-[#514f4f]"
            />
          </div>
        </div>
      </div>

      {/* Casa habilitada */}
      {tieneCasa && (
        <div className="flex flex-col gap-2 mb-4">
          <label className={LABEL_CLS}>
            ¿La casa está habilitada? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {([{ label: "Sí", value: true }, { label: "No", value: false }] as const).map(
              ({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onCasaHabilitadaChange(value)}
                  className={`flex-1 h-[45.6px] rounded-[10px] border-[0.8px] font-['Arimo',sans-serif] text-[16px] transition-colors cursor-pointer ${
                    formData.casaHabilitada === value
                      ? "bg-[#308c58] text-white border-[#308c58]"
                      : "bg-white text-[#514f4f] border-[#d1d5dc] hover:border-[#308c58]"
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Apartamentos */}
      {tieneApts && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label className={LABEL_CLS}>
              Cantidad de Apartamentos <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="cantidadApartamentos"
              value={formData.cantidadApartamentos}
              onChange={onChange}
              placeholder="Ej: 4"
              min="1"
              step="1"
              required
              className={INPUT_CLS}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={LABEL_CLS}>
              Apartamentos Habitados <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="apartamentosHabitados"
              value={formData.apartamentosHabitados}
              onChange={onChange}
              placeholder="Ej: 3"
              min="0"
              step="1"
              required
              className={INPUT_CLS}
            />
          </div>
        </div>
      )}
    </div>
  );
}
