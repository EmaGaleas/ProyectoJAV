import React from 'react';
import type { BalanceRecord } from './typesReportes';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PAGE_SIZE = 9;
const ROW_H = 55;
const MIN_W = 900;

// Utilidades de formato
const fmtLps = (n: number) => `L. ${n.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;
const fmtDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${d} ${meses[parseInt(m) - 1]} ${y}`;
};

interface Props {
  records: BalanceRecord[];
  page: number;
  onPage: (p: number) => void;
}

export function BalanceTable({ records, page, onPage }: Props) {
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const safePage = Math.min(page - 1, totalPages - 1);
  const pageItems = records.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const slots = Array.from({ length: PAGE_SIZE }).map((_, i) => pageItems[i] ?? null);

  const COLS = "120px 140px 1.2fr 2fr 130px";
  const headers = ["Fecha", "Movimiento", "Categoría", "Descripción", "Monto"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] flex flex-col overflow-x-auto">
      <div style={{ minWidth: MIN_W }}>
        
        {/* Encabezados de Tabla */}
        <div className="grid shrink-0 border-b border-[rgba(0,0,0,0.07)]" style={{ gridTemplateColumns: COLS }}>
          {headers.map((h, i) => (
            <div key={i} className={`px-4 py-3 ${i === 4 ? 'text-right' : ''}`}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8EBFA3", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {h}
              </span>
            </div>
          ))}
        </div>

        {/* Filas de Datos */}
        <div className="flex flex-col flex-1">
          {slots.map((r, i) => {
            const isIngreso = r?.tipo === 'Ingreso';
            
            return (
              <div
                key={r ? r.id : `empty-${i}`}
                className={`grid ${r ? "hover:bg-[#F8FDFB]" : ""} transition-colors items-center`}
                style={{ 
                  gridTemplateColumns: COLS, 
                  height: ROW_H, 
                  borderBottom: i < PAGE_SIZE - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" 
                }}
              >
                {r ? (
                  <>
                    <div className="px-4 text-[13px] text-[#514f4f] font-medium">
                      {fmtDate(r.fecha)}
                    </div>
                    <div className="px-4">
                      <span 
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md"
                        style={{ 
                          background: isIngreso ? '#E6F3EC' : '#FEE2E2', 
                          color: isIngreso ? '#308C58' : '#c0392b' 
                        }}
                      >
                        {isIngreso ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {r.tipo}
                      </span>
                    </div>
                    <div className="px-4 text-[13px] text-[#1A1A1A] font-semibold truncate">
                      {r.categoria}
                    </div>
                    <div className="px-4 text-[13px] text-[#514f4f] truncate">
                      {r.descripcion}
                    </div>
                    <div 
                      className="px-4 text-right text-[14px] font-bold truncate"
                      style={{ color: isIngreso ? '#308C58' : '#c0392b' }}
                    >
                      {isIngreso ? '+' : '-'} {fmtLps(r.monto)}
                    </div>
                  </>
                ) : (
                  <div style={{ gridColumn: `1 / 6` }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Paginación (idéntica a tus otras tablas) */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,0,0,0.06)] shrink-0" style={{ background: "#FAFAFA" }}>
          <span style={{ fontSize: 11, color: "#8EBFA3", fontWeight: 600 }}>
            {records.length === 0 
              ? "Sin resultados" 
              : `${safePage * PAGE_SIZE + 1}–${Math.min((safePage + 1) * PAGE_SIZE, records.length)} de ${records.length} registros`}
          </span>
          <div className="flex items-center gap-1">
            <PageBtn onClick={() => onPage(1)} disabled={safePage === 0}>«</PageBtn>
            <PageBtn onClick={() => onPage(safePage)} disabled={safePage === 0}>‹</PageBtn>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <PageBtn key={idx} onClick={() => onPage(idx + 1)} disabled={false} active={idx === safePage}>
                {idx + 1}
              </PageBtn>
            ))}
            <PageBtn onClick={() => onPage(safePage + 2)} disabled={safePage === totalPages - 1}>›</PageBtn>
            <PageBtn onClick={() => onPage(totalPages)} disabled={safePage === totalPages - 1}>»</PageBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponente de Paginación
function PageBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 cursor-pointer hover:bg-[#E6F3EC]"
      style={{
        width: 28, height: 28, fontSize: 12, fontWeight: active ? 700 : 500,
        background: active ? "#308C58" : "transparent", color: active ? "#fff" : "#514f4f",
      }}
    >
      {children}
    </button>
  );
}