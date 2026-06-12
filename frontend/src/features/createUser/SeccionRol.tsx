import { ChevronRight } from "lucide-react";
import type { CreateUserFormData } from "./types";
import { LABEL_CLS, SECTION_TITLE_CLS, SELECT_CLS } from "./types";

const ROLES = [
  { value: "0", label: "Cliente / Dueño de Casa" },
  { value: "1", label: "Tesorero" },
  { value: "2", label: "Secretario" },
  { value: "3", label: "Vocal" },
  { value: "4", label: "Vicepresidente" },
  { value: "5", label: "Presidente" },
  { value: "6", label: "Fiscal" },
];

interface Props {
  formData: CreateUserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function SeccionRol({ formData, onChange }: Props) {
  return (
    <div>
      <h3 className={SECTION_TITLE_CLS}>Tipo de Usuario</h3>
      <div className="flex flex-col gap-2">
        <label className={LABEL_CLS}>
          Rol <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            name="rol"
            value={formData.rol}
            onChange={onChange}
            required
            className={SELECT_CLS}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronRight
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-[#514f4f]"
          />
        </div>
        <p className="text-[#6b7280] text-[13px] font-['Arimo',sans-serif]">
          Como SuperAdministrador puedes asignar cualquier rol
        </p>
      </div>
    </div>
  );
}
