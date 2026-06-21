import type { MorosoRecord } from './typesReportes';
import { AlertCircle, MapPin } from 'lucide-react';

const PAGE_SIZE = 9;
const ROW_H = 55;
const MIN_W = 900;

export function MorososTable({ records, page }: { records: MorosoRecord[], page: number }) {  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const safePage = Math.min(page - 1, totalPages - 1);
  const pageItems = records.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const slots = Array.from({ length: PAGE_SIZE }).map((_, i) => pageItems[i] ?? null);

  const COLS = "1.5fr 1fr 1.2fr 1.5fr 120px";
  const headers = ["Residente", "Ubicación", "Atraso", "Detalle de Deuda", "Monto Total"];

  const fmtLps = (n: number) => `L. ${n.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] flex flex-col overflow-x-auto">
      <div style={{ minWidth: MIN_W }}>
        <div className="grid shrink-0 border-b border-[rgba(0,0,0,0.07)]" style={{ gridTemplateColumns: COLS }}>
          {headers.map((h, i) => (
            <div key={i} className={`px-4 py-3 ${i === 4 ? 'text-right' : ''}`}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8EBFA3", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col flex-1">
          {slots.map((r, i) => (
            <div
              key={r ? r.id : `empty-${i}`}
              className={`grid ${r ? "hover:bg-[#F8FDFB]" : ""} transition-colors items-center`}
              style={{ gridTemplateColumns: COLS, height: ROW_H, borderBottom: i < PAGE_SIZE - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
            >
              {r ? (
                <>
                  <div className="px-4 flex flex-col justify-center">
                    <span className="text-[13px] font-bold text-[#1A1A1A] truncate">{r.residente}</span>
                    <span className="text-[11px] text-[#9fa3a5] truncate">DNI: {r.dni}</span>
                  </div>
                  <div className="px-4 flex items-center gap-1.5 text-[12px] text-[#514f4f]">
                    <MapPin size={13} className="text-[#308C58]" /> Blq. {r.ubicacion.bloque}, Lte. {r.ubicacion.lote}
                  </div>
                  <div className="px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md" 
                          style={{ background: r.mesesAtraso >= 3 ? '#FEE2E2' : '#FEF3C7', color: r.mesesAtraso >= 3 ? '#c0392b' : '#b7791f' }}>
                      <AlertCircle size={12} /> {r.mesesAtraso} Meses vencidos
                    </span>
                  </div>
                  <div className="px-4 text-[13px] text-[#514f4f] truncate">{r.detalleDeuda}</div>
                  <div className="px-4 text-right text-[14px] font-bold text-[#c0392b]">{fmtLps(r.montoTotal)}</div>
                </>
              ) : (
                <div style={{ gridColumn: `1 / 6` }} />
              )}
            </div>
          ))}
        </div>

        {/* Paginación exacta a la de MultasTable */}
        {/* ... (Puedes copiar aquí el footer de paginación de MultasTable) ... */}
      </div>
    </div>
  );
}