import type { MorosoRecord } from './typesReportes';
import { fmtLps } from './utilsReportes';
import { PAGE_SIZE, ROW_H, MIN_W, PaginationFooter } from './tableUtils';

const COLS    = '1.4fr 100px 1fr 110px 1.4fr 120px';
const HEADERS = ['Residente', 'DNI', 'Ubicación', 'Atraso', 'Detalle de Deuda', 'Monto Total'];

interface Props {
  records: MorosoRecord[];
  page:    number;
  onPage:  (p: number) => void;
}

export function MorososTable({ records, page, onPage }: Props) {
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
          {slots.map((r, i) => (
            <div
              key={r ? r.id : `empty-${i}`}
              className={`grid ${r ? 'hover:bg-[#F8FDFB]' : ''} transition-colors items-center`}
              style={{ gridTemplateColumns: COLS, height: ROW_H, borderBottom: i < PAGE_SIZE - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
            >
              {r ? (
                <>
                  {/* Residente */}
                  <div className="px-4 text-[13px] font-bold text-[#1A1A1A] truncate">{r.residente}</div>

                  {/* DNI */}
                  <div className="px-0 text-[12px] text-[#9fa3a5] truncate">{r.dni}</div>

                  {/* Ubicación */}
                  <div className="px-4 text-[12px] text-[#514f4f]">
                    Blq. {r.ubicacion.bloque}, Lte. {r.ubicacion.lote}
                  </div>

                  {/* Atraso */}
                  <div className="px-2">
                    <span
                      className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md"
                      style={{
                        background: r.mesesAtraso >= 3 ? '#FEE2E2' : '#FEF3C7',
                        color:      r.mesesAtraso >= 3 ? '#c0392b' : '#b7791f',
                      }}
                    >
                      {r.mesesAtraso} {r.mesesAtraso === 1 ? 'mes' : 'meses'}
                    </span>
                  </div>

                  {/* Detalle */}
                  <div className="px-4 text-[13px] text-[#514f4f] truncate">{r.detalleDeuda}</div>

                  {/* Monto */}
                  <div className="px-4 text-right text-[14px] font-bold text-[#c0392b]">{fmtLps(r.montoTotal)}</div>
                </>
              ) : (
                <div style={{ gridColumn: '1 / 7' }} />
              )}
            </div>
          ))}
        </div>

        <PaginationFooter page={page} total={records.length} onPage={onPage} />
      </div>
    </div>
  );
}