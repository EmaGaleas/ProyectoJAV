import { useState } from "react";
import { SeccionMensualidad } from "./SeccionMensualidad";
import { SeccionMultas } from "./SeccionMultas";
import { SeccionConexion } from "./SeccionConexion";
import { SeccionMora } from "./SeccionMora";

type MainTab = "mensualidad" | "multas" | "mora" | "conexion";
type SubTab  = "estado" | "proximas" | "historial";

const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: "mensualidad", label: "Mensualidad" },
  { key: "multas",      label: "Multas"       },
  { key: "mora",        label: "Mora"          },
  { key: "conexion",    label: "Conexión"      },
];

const SUB_TABS: { key: SubTab; label: string; desc: string }[] = [
  { key: "estado",    label: "Estado Actual",      desc: "Monto y rango de vigencia activos en este momento." },
  { key: "proximas",  label: "Próximas Vigencias",  desc: "Montos programados para entrar en vigencia en el futuro." },
  { key: "historial", label: "Historial",           desc: "Registro de todos los montos y cambios anteriores." },
];

// ─── Tab bar — mismo estilo que EgresoTabs ────────────────────────────────────

function TabBar<T extends string>({
  tabs,
  active,
  onSelect,
  size = "md",
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onSelect: (k: T) => void;
  size?: "md" | "sm";
}) {
  return (
    <div className="flex gap-0 border-b border-[#e0e0e0]">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onSelect(t.key)}
            style={{
              background:   "none",
              border:       "none",
              borderBottom: isActive ? "2px solid #308C58" : "2px solid transparent",
              marginBottom: "-1px",
              color:        isActive ? "#308C58" : "#6b7280",
              cursor:       "pointer",
              padding:      size === "sm" ? "6px 16px" : "10px 20px",
              fontFamily:   "'Arimo', sans-serif",
              fontSize:     size === "sm" ? "13px" : "15px",
              fontWeight:   isActive ? 600 : 400,
              whiteSpace:   "nowrap",
              transition:   "color 0.15s",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ConfiguracionCobros() {
  const [mainTab, setMainTab] = useState<MainTab>("mensualidad");
  const [subTab,  setSubTab]  = useState<SubTab>("estado");

  const handleMainTab = (tab: MainTab) => { setMainTab(tab); setSubTab("estado"); };
  const subDesc = SUB_TABS.find((s) => s.key === subTab)?.desc ?? "";

  return (
    <div className="flex flex-col gap-0">

      {/* ── Tabs principales — sobre el fondo gris ── */}
      <TabBar tabs={MAIN_TABS} active={mainTab} onSelect={handleMainTab} />

      {/* ── Card blanca desde aquí hacia abajo ── */}
      <div className="bg-white rounded-b-[16px] rounded-tr-[16px] shadow-sm border border-t-0 border-[#e5e7eb] p-6 flex flex-col gap-5">

        {/* Sub-tabs — estilo píldoras ── */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            {SUB_TABS.map((s) => {
              const isActive = s.key === subTab;
              return (
                <button
                  key={s.key}
                  onClick={() => setSubTab(s.key)}
                  className={`h-[34px] px-4 rounded-[20px] font-['Arimo',sans-serif] text-[13px] transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#308c58] text-white"
                      : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          <p className="font-['Arimo',sans-serif] text-[12px] text-[#9ca3af] italic">{subDesc}</p>
        </div>

        {/* ── Contenido ── */}
        {mainTab === "mensualidad" && <SeccionMensualidad subTab={subTab} />}
        {mainTab === "multas"      && <SeccionMultas      subTab={subTab} />}
        {mainTab === "mora"        && <SeccionMora        subTab={subTab} />}
        {mainTab === "conexion"    && <SeccionConexion    subTab={subTab} />}
      </div>
    </div>
  );
}
