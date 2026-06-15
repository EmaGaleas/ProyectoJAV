import type { UserRole, UserStatus } from "./GestionarUsuarios";


export interface Filters {
  role: UserRole | "";
  status: UserStatus | "";
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
}

export const DEFAULT_FILTERS: Filters = { role: "", status: "" };

export function UserFilters({ filters, onChange, onApply }: Props) {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] p-5 flex flex-col h-full"
      style={{ minWidth: 220 }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#1A1A1A",
          marginBottom: 20,
        }}
      >
        Filtros
      </span>

      {/* Rol */}
      <FilterGroup label="Rol">
        {(
          [
            "Admin",
            "Residente",
            "Tesorero",
            "Secretario",
            "Vocal",
            "Presidente",
            "Vicepresidente",
            "Fiscal",
          ] as UserRole[]
        ).map((role) => (
          <CheckRow
            key={role}
            label={role}
            checked={filters.role === role}
            onChange={() => set("role", filters.role === role ? "" : role)}
          />
        ))}
      </FilterGroup>

      {/* Estado */}
      <FilterGroup label="Estado">
        {(["Activo", "Inactivo"] as UserStatus[]).map((s) => (
          <CheckRow
            key={s}
            label={s}
            checked={filters.status === s}
            onChange={() => set("status", filters.status === s ? "" : s)}
          />
        ))}
      </FilterGroup>

      {/* Cantidad de propiedades */}

      <div className="flex-1" />

      <button
        onClick={onApply}
        className="w-full py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        style={{
          background: "#308C58",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Aplicar filtros
      </button>
    </div>
  );
}

// ─── sub-componentes locales ──────────────────────────────────────────────────

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={onChange}
        className="flex items-center justify-center rounded-full shrink-0 transition-colors cursor-pointer"
        style={{
          width: 20,
          height: 20,
          border: `2px solid ${checked ? "#308C58" : "rgba(0,0,0,0.2)"}`,
          background: checked ? "#308C58" : "#fff",
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5L4.5 7.5L8.5 2.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 13, color: "#1A1A1A" }}>{label}</span>
    </label>
  );
}
