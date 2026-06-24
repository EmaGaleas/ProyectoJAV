// MultasTable.tsx
import type { MultaRecord } from "./types";
import { L, fmtDate } from "./types";

const PAGE_SIZE = 9;
const ROW_H = 49;
const MIN_W = 950;

interface Props {
  records: MultaRecord[];
  page: number;
  onPage: (p: number) => void;
  onDetails: (r: MultaRecord) => void;
}

export function MultasTable({ records, page, onPage, onDetails }: Props) {
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const safePage = Math.min(page - 1, totalPages - 1);
  const pageItems = records.slice(
    safePage * PAGE_SIZE,
    (safePage + 1) * PAGE_SIZE,
  );
  const slots = Array.from({ length: PAGE_SIZE }).map(
    (_, i) => pageItems[i] ?? null,
  );

  const COLS = "110px 1fr 1fr 1.5fr 110px 110px 95px";
  const headers = [
    "Código",
    "Persona multada",
    "DNI",
    "Tipo de multa",

    "Monto",
    "",
  ];
  const prefix = "MULT-";
  return (
    <div className="flex flex-col gap-3 flex-1 min-w-0">
      <div className="bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.07)] flex flex-col overflow-x-auto">
        <div style={{ minWidth: MIN_W }}>
          {/* Header */}
          <div
            className="grid shrink-0 border-b border-[rgba(0,0,0,0.07)]"
            style={{ gridTemplateColumns: COLS }}
          >
            {headers.map((h, i) => (
              <div key={i} className="px-3 py-3">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#8EBFA3",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col flex-1">
            {slots.map((r, i) => (
              <div
                key={r ? r.idMulta : `empty-${i}`}
                className={`grid ${r ? "hover:bg-[#F8FDFB]" : ""} transition-colors`}
                style={{
                  gridTemplateColumns: COLS,
                  height: ROW_H,
                  borderBottom:
                    i < PAGE_SIZE - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                }}
              >
                {r ? (
                  <>
                    <Cell text={`${prefix}` + r.idMulta} bold />
                    <Cell text={r.nombreUsuario} />
                    <Cell text={r.dni} />
                    <Cell text={r.tipoDescripcion} />
                    <Cell text={fmtDate(r.fecha ?? "")} />
                    <Cell text={L(r.monto)} />
                    <div className="px-3 flex items-center">
                      <button
                        onClick={() => onDetails(r)}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#308C58",
                          whiteSpace: "nowrap",
                        }}
                        className="hover:underline"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ gridColumn: `1 / 8` }} />
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,0,0,0.06)] shrink-0"
            style={{ background: "#FAFAFA" }}
          >
            <span style={{ fontSize: 11, color: "#8EBFA3" }}>
              {records.length === 0
                ? "Sin resultados"
                : `${safePage * PAGE_SIZE + 1}–${Math.min((safePage + 1) * PAGE_SIZE, records.length)} de ${records.length} registros`}
            </span>
            <div className="flex items-center gap-0.5">
              <PageBtn onClick={() => onPage(1)} disabled={safePage === 0}>
                «
              </PageBtn>
              <PageBtn
                onClick={() => onPage(safePage)}
                disabled={safePage === 0}
              >
                ‹
              </PageBtn>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PageBtn
                  key={i}
                  onClick={() => onPage(i + 1)}
                  disabled={false}
                  active={i === safePage}
                >
                  {i + 1}
                </PageBtn>
              ))}
              <PageBtn
                onClick={() => onPage(safePage + 2)}
                disabled={safePage === totalPages - 1}
              >
                ›
              </PageBtn>
              <PageBtn
                onClick={() => onPage(totalPages)}
                disabled={safePage === totalPages - 1}
              >
                »
              </PageBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({ text, bold }: { text: string; bold?: boolean }) {
  return (
    <div className="px-3 flex items-center overflow-hidden">
      <span
        className="truncate"
        style={{ fontSize: 13, color: "#1A1A1A", fontWeight: bold ? 600 : 400 }}
      >
        {text}
      </span>
    </div>
  );
}

function PageBtn({
  onClick,
  disabled,
  active,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
      style={{
        width: 26,
        height: 26,
        fontSize: 12,
        fontWeight: active ? 700 : 400,
        background: active ? "#308C58" : "transparent",
        color: active ? "#fff" : "#555",
      }}
    >
      {children}
    </button>
  );
}
