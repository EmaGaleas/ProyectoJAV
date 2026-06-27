import type { CreateUserFormData } from "./types";
import { SECTION_TITLE_CLS } from "./types";

interface Props {
  formData: CreateUserFormData;
  onEstadoChange: (estado: boolean) => void;
  disable: boolean;
}

export function SeccionEstado({ formData, onEstadoChange, disable }: Props) {
  const isActive = formData.estado ?? true;
  const estado = isActive ? "Activo" : "Inactivo";

  return (
    <div>
      <h3 className={SECTION_TITLE_CLS}>Estado del Usuario</h3>
      <div className="flex items-center gap-4">
        {/* Badge Activo/Inactivo */}
        <div
          className={`flex rounded-3xl ${isActive ? "bg-[#308C58]" : "bg-[#8C3F40]"} h-8 w-24 items-center justify-center`}
        >
          <p className="text-white text-center text-sm font-semibold">
            {estado.toUpperCase()}
          </p>
        </div>

        {/* Switch Toggle */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={(e) => onEstadoChange(e.target.checked)}
            disabled={disable}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#308C58]"></div>
        </label>
      </div>
    </div>
  );
}
