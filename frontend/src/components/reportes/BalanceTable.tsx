import type { BalanceRecord } from './typesReportes';
import { fmtLps, fmtDate } from './utilsReportes';
import { PAGE_SIZE, ROW_H, MIN_W, PaginationFooter } from './tableUtils';

const COLS    = '100px 120px 130px 1.2fr 2fr 130px';
const HEADERS = ['Código', 'Fecha', 'Movimiento', 'Categoría', 'Descripción', 'Monto'];

interface Props {
  records: BalanceRecord[];
  page:    number;
  onPage:  (p: number) => void;
}

export function BalanceTable({ records, page, onPage }: Props) {
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const safe       = Math.min(page - 1, totalPages - 1);
  const pageItems  = records.slice(safe * PAGE_SIZE, (safe + 1) * PAGE_SIZE);
  const slots      = Array.from({ length: PAGE_SIZE }).map((_, i) => pageItems[i] ?? null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] flex flex-col overflow-x-auto">
      <div style={{ minWidth: MIN_W }}>

        {/* Encabezados */}
        <div className="grid shrink-0 border-b border-[rgba(0,0,0,0.07)]" style={{ gridTemplateColumns: COLS }}>
          {HEADERS.map((h, i) => (
            <div key={i} className={`px-4 py-3 ${i === 5 ? 'text-right' : ''}`}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#8EBFA3', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {h}
              </span>
            </div>
          ))}
        </div>

        {/* Filas */}
        <div className="flex flex-col flex-1">
          {slots.map((r, i) => {
            const isIngreso = r?.tipo === 'Ingreso';
            return (
              <div
                key={r ? r.id : `empty-${i}`}
                className={`grid ${r ? 'hover:bg-[#F8FDFB]' : ''} transition-colors items-center`}
                style={{ gridTemplateColumns: COLS, height: ROW_H, borderBottom: i < PAGE_SIZE - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
              >
                {r ? (
                  <>
                    {/* Código */}
                    <div className="px-4 text-[12px] font-mono text-[#9fa3a5] truncate">{r.codigo}</div>

                    {/* Fecha */}
                    <div className="px-4 text-[13px] text-[#514f4f] font-medium">{fmtDate(r.fecha)}</div>

                    {/* Movimiento — solo color, sin ícono */}
                    <div className="px-4">
                      <span
                        className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md"
                        style={{
                          background: isIngreso ? '#E6F3EC' : '#FEE2E2',
                          color:      isIngreso ? '#308C58' : '#c0392b',
                        }}
                      >
                        {r.tipo}
                      </span>
                    </div>

                    {/* Categoría */}
                    <div className="px-4 text-[13px] text-[#1A1A1A] font-semibold truncate">{r.categoria}</div>

                    {/* Descripción */}
                    <div className="px-4 text-[13px] text-[#514f4f] truncate">{r.descripcion}</div>

                    {/* Monto */}
                    <div className="px-4 text-right text-[14px] font-bold truncate" style={{ color: isIngreso ? '#308C58' : '#c0392b' }}>
                      {isIngreso ? '+' : '-'} {fmtLps(r.monto)}
                    </div>
                  </>
                ) : (
                  <div style={{ gridColumn: '1 / 7' }} />
                )}
              </div>
            );
          })}
        </div>

        <PaginationFooter page={page} total={records.length} onPage={onPage} />
      </div>
    </div>
  );
}