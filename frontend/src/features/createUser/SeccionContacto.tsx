import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { CreateUserFormData } from "./types";
import { INPUT_CLS, LABEL_CLS, SECTION_TITLE_CLS } from "./types";

interface Props {
  formData: CreateUserFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onCelularChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SeccionContacto({
  formData,
  onChange,
  onCelularChange,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h3 className={SECTION_TITLE_CLS}>Información de Contacto</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLS}>
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={onChange}
            placeholder="ejemplo@correo.com"
            required
            className={INPUT_CLS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className={LABEL_CLS}>
            Celular <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="celular"
            value={formData.celular}
            onChange={onCelularChange}
            placeholder="+504 12345678"
            required
            className={INPUT_CLS}
          />
          <p className="text-[#6b7280] text-[13px] font-['Arimo',sans-serif]">
            +504 seguido de 8 dígitos
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className={LABEL_CLS}>
          Contraseña <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="contrasena"
            value={formData.contrasena}
            onChange={onChange}
            placeholder="Mínimo 6 caracteres"
            required
            className={`${INPUT_CLS} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#abafb1] hover:text-[#514f4f] transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}