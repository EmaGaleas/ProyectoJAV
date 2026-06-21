import type { DatosSemana, MetricasUsuarios } from './types';

// ── GRÁFICA DE BARRAS AGRUPADAS (Ingresos vs Egresos por Semana) ──
export function WeeklyBarChart({ data, maxVal }: { data: DatosSemana[]; maxVal: number }) {
  const fmt = (num: number) => `L. ${num.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;

  return (
    <div className="bg-white p-6 rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-sm flex flex-col h-[320px]">
      <h3 className="font-['Montserrat',sans-serif] font-semibold text-[#364153] text-[16px] mb-6">
        Flujo de Caja Mensual (Por Semana)
      </h3>
      
      <div className="flex-1 flex items-end justify-around gap-2 pb-2 border-b border-[#e5e7eb] relative">
        {data.map((item, idx) => {
          const htIngreso = `${(item.ingresos / maxVal) * 100}%`;
          const htEgreso = `${(item.egresos / maxVal) * 100}%`;

          return (
            <div key={idx} className="relative group flex items-end gap-2 h-full w-full justify-center">
              
              {/* Tooltip On Hover */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                <p className="font-bold mb-1 border-b border-gray-600 pb-1">{item.semana}</p>
                <p className="text-[#8EBFA3]">Ingreso: {fmt(item.ingresos)}</p>
                <p className="text-[#E07A5F]">Egreso: {fmt(item.egresos)}</p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]"></div>
              </div>

              {/* Barra Ingresos */}
              <div 
                className="w-8 bg-[#308C58] rounded-t-md transition-all duration-500 hover:brightness-110 cursor-pointer"
                style={{ height: htIngreso }}
              ></div>
              {/* Barra Egresos */}
              <div 
                className="w-8 bg-[#E07A5F] rounded-t-md transition-all duration-500 hover:brightness-110 cursor-pointer"
                style={{ height: htEgreso }}
              ></div>
              
              {/* Etiqueta Eje X */}
              <span className="absolute -bottom-7 text-xs font-['Arimo',sans-serif] text-[#6b7280]">
                {item.semana}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Leyenda */}
      <div className="flex justify-center gap-6 mt-10 text-xs font-['Arimo',sans-serif]">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#308C58]"></span> Ingresos</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#E07A5F]"></span> Egresos</div>
      </div>
    </div>
  );
}

// ── GRÁFICA DE ANILLO (Distribución de Usuarios) ──
export function UsersDonutChart({ usuarios }: { usuarios: MetricasUsuarios }) {
  const { activos, inactivos, morosos, total } = usuarios;
  const pctActivos = Math.round((activos / total) * 100);
  const pctMorosos = Math.round((morosos / total) * 100);
  const pctInactivos = Math.round((inactivos / total) * 100);

  return (
    <div className="bg-white p-6 rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-sm flex flex-col h-[320px]">
      <h3 className="font-['Montserrat',sans-serif] font-semibold text-[#364153] text-[16px] mb-2">
        Estado de Usuarios
      </h3>
      
      <div className="flex-1 flex items-center justify-around gap-4 group relative">
        
        {/* Tooltip On Hover Centralizado */}
        <div className="absolute top-4 right-4 bg-[#1A1A1A] text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
          <p className="font-bold border-b border-gray-600 pb-1 mb-1">Detalle</p>
          <p className="text-[#308C58]">Al Día: {activos}</p>
          <p className="text-[#E2A540]">Morosos: {morosos}</p>
          <p className="text-[#9fa3a5]">Inactivos: {inactivos}</p>
        </div>

        <div className="relative w-36 h-36 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-sm">
            {/* Fondo */}
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="4" />
            {/* Activos */}
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#308C58" strokeWidth="4" strokeDasharray={`${pctActivos} ${100 - pctActivos}`} strokeDashoffset="0" className="transition-all duration-1000" />
            {/* Morosos */}
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2A540" strokeWidth="4" strokeDasharray={`${pctMorosos} ${100 - pctMorosos}`} strokeDashoffset={-pctActivos} className="transition-all duration-1000" />
            {/* Inactivos */}
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#9fa3a5" strokeWidth="4" strokeDasharray={`${pctInactivos} ${100 - pctInactivos}`} strokeDashoffset={-(pctActivos + pctMorosos)} className="transition-all duration-1000" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[11px] font-bold text-[#B0C8BA] uppercase">Total</span>
            <span className="text-2xl font-bold text-[#1A1A1A]">{total}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0">
          <Leyenda color="#308C58" label="Al Día" value={activos} pct={pctActivos} />
          <Leyenda color="#E2A540" label="En Mora" value={morosos} pct={pctMorosos} />
          <Leyenda color="#9fa3a5" label="Inactivos" value={inactivos} pct={pctInactivos} />
        </div>
      </div>
    </div>
  );
}

function Leyenda({ color, label, value, pct }: { color: string; label: string; value: number; pct: number }) {
  return (
    <div className="flex items-center gap-2 text-xs font-['Arimo',sans-serif]">
      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-[#514f4f] min-w-[65px]">{label}:</span>
      <span className="font-bold text-[#1A1A1A]">{value}</span>
      <span className="text-[#9fa3a5] text-[10px]">({pct}%)</span>
    </div>
  );
}