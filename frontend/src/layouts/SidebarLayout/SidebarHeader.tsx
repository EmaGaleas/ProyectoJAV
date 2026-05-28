import logoJav from '../../assets/logo.png';

interface SidebarHeaderProps {
  cargo: string;
  nombre: string;
}

export const SidebarHeader = ({ cargo: cargo, nombre }: SidebarHeaderProps) => (
  <div className="flex flex-col gap-4 w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
        <img
          src={logoJav}
          alt="Logo Junta de Agua Villalinda"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-[16px] font-semibold uppercase tracking-[0.14em] text-[#8EBFA3] leading-none">
          {cargo}
        </span>
        <span className="text-[14px] font-semibold text-[#181454] leading-snug mt-[5px] break-words">
          {nombre}
        </span>
      </div>
    </div>
    <div className="w-full h-px bg-[#93C5A9] opacity-50 rounded-full" />
  </div>
);