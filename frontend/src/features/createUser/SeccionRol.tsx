import { ChevronRight } from "lucide-react";
import type { CreateUserFormData } from "./types";
import { LABEL_CLS, SECTION_TITLE_CLS, SELECT_CLS } from "./types";
import type { User } from "../gestionUsuarios/GestionarUsuarios";

const ROLES = [
  { value: "0", rol: "DuenoDeCasa", label: "Cliente / Dueño de Casa" },
  { value: "1", rol: "Tesorero", label: "Tesorero" },
  { value: "2", rol: "Secretario", label: "Secretario" },
  { value: "3", rol: "Vocal", label: "Vocal" },
  { value: "4", rol: "Vicepresidente", label: "Vicepresidente" },
  { value: "5", rol: "Presidente", label: "Presidente" },
  { value: "6", rol: "Fiscal", label: "Fiscal" },
];

interface Props {
  formData: CreateUserFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  disable: boolean;
  users: User[];
}

export function SeccionRol({ formData, onChange, disable, users }: Props) {
  const ROLE_LIMITS: Record<string, number> = {
    Presidente: 1,
    Tesorero: 1,
    Secretario: 1,
    Vocal: 3,
    Vicepresidente: 1,
    Fiscal: 1,

    DuenoDeCasa: Infinity,
  };

  const getRoleCounts = (users: User[]) => {
    return users
      .filter((user) => user.estado)
      .reduce(
        (acc, user) => {
          acc[user.rol] = (acc[user.rol] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
  };
  const getRoleOptions = (users: User[]) => {
    const counts = getRoleCounts(users);

    return ROLES.map((role) => {
      const limit = ROLE_LIMITS[role.rol] ?? 1;
      const current = counts[role.rol] ?? 0;

      return {
        ...role,
        disabled: current >= limit,
      };
    });
  };
  const availableRoles = getRoleOptions(users);

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
            disabled={disable}
          >
            {availableRoles.map((r) => (
              <option key={r.value} value={r.rol} disabled={r.disabled}>
                {r.label}
                {r.disabled ? " (No disponible)" : ""}
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
