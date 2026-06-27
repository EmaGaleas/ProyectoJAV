import type { DashboardStatus, TransaccionResumen } from './types';

// ── Tarjeta de Indicador de Alto Nivel ──────────────────────────────
interface KpiProps {
  label: string;
  value: string | number;
  subtext: string;
  textColor?: string;
}

export function KpiCard({ label, value, subtext ,  textColor = '#1A1A1A'}: KpiProps) {
 
  return (
    <div className="bg-white p-5 rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-sm flex flex-col gap-1.5 transition-all hover:translate-y-[-2px]">
      <span
        style={{
          fontSize: 10, fontWeight: 700, color: '#B0C8BA', letterSpacing: '0.08em', textTransform: 'uppercase'
        }}
      >
        {label}
      </span>
      <span
        className="text-2xl font-bold font-['Montserrat',sans-serif]"
        style={{ color: textColor }}
      >
        {value}
      </span>
      <span className="text-[11px] text-[#9fa3a5] font-['Arimo',sans-serif]">
        {subtext}
      </span>
    </div>
  )
}

// ── Tabla del Listado Operativo por Pestañas ────────────────────────
interface TableProps {
  titulo: string;
  activeTab: DashboardStatus;
  onTabChange: (status: DashboardStatus) => void;
  counts: Record<DashboardStatus, number>;
  records: TransaccionResumen[];
}

export function MiniTransactionTable({ titulo, activeTab, onTabChange, counts, records }: TableProps) {
  const tabs: DashboardStatus[] = ['En Revisión', 'Aprobado', 'Procesado'];

  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-sm overflow-hidden flex flex-col flex-1">
      <div className="px-5 pt-4 pb-2">
        <h3 className="font-['Montserrat',sans-serif] font-semibold text-[#364153] text-[15px] mb-3">
          {titulo}
        </h3>
        
        {/* Barra de pestañas exactamente paralela a MultasTabs */}
        <div className="flex gap-2 border-b border-[#e0e0e0]">
          {tabs.map(t => {
            const isActive = t === activeTab;
            return (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                className="px-3 py-2 text-xs font-medium transition-colors relative cursor-pointer"
                style={{
                  color: isActive ? '#308C58' : '#6b7280',
                  borderBottom: isActive ? '2px solid #308C58' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {t === 'En Revisión' ? 'En Revisión' : t === 'Aprobado' ? 'Aprobados' : 'Procesados'}
                <span
                  className="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]"
                  style={{
                    background: isActive ? '#e6f3ec' : '#f3f4f6',
                    color: isActive ? '#308C58' : '#6b7280',
                  }}
                >
                  {counts[t]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido de la Lista */}
      <div className="flex flex-col flex-1 divide-y divide-[rgba(0,0,0,0.04)] px-5 pb-4 overflow-y-auto">
        {records.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#9fa3a5] font-['Arimo',sans-serif]">
            No hay registros en este estado.
          </div>
        ) : (
          records.map(r => (
            <div key={r.id} className="py-3 flex justify-between items-center text-xs font-['Arimo',sans-serif]">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-[#1A1A1A]">{r.descripcion}</span>
                <span className="text-[10px] text-[#9fa3a5]">{r.codigo} • Por {r.usuario}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="font-bold text-[13px]" style={{ color: r.tipo === 'Ingreso' ? '#308C58' : '#A34F4F' }}>
                  {r.tipo === 'Ingreso' ? '+' : '-'} L. {r.monto.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#b0b4b6]">{r.fecha}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}