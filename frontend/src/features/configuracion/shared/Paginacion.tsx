import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 7;
export { PAGE_SIZE };

interface Props {
  total: number;
  page: number;
  pageSize?: number;
  onChange: (page: number) => void;
}

export function Paginacion({ total, page, pageSize = PAGE_SIZE, onChange }: Props) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = page * pageSize + 1;
  const to   = Math.min((page + 1) * pageSize, total);

  // Max 7 page buttons; collapse with ellipsis if needed
  const pages: (number | "…")[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const near = new Set([0, totalPages - 1, page, page - 1, page + 1].filter(n => n >= 0 && n < totalPages));
    const sorted = [...near].sort((a, b) => a - b);
    const result: (number | "…")[] = [];
    let prev = -1;
    for (const n of sorted) {
      if (n - prev > 1) result.push("…");
      result.push(n);
      prev = n;
    }
    return result;
  })();

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-[#e5e7eb] bg-white">
      <p className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">
        {from}–{to} de {total} registros
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 0}
          onClick={() => onChange(page - 1)}
          className="h-[32px] w-[32px] rounded-[6px] border border-[#d1d5dc] flex items-center justify-center text-[#514f4f] hover:bg-[#f9fafb] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="h-[32px] min-w-[32px] flex items-center justify-center text-[#6b7280] font-['Arimo',sans-serif] text-[13px]">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`h-[32px] min-w-[32px] px-2 rounded-[6px] font-['Arimo',sans-serif] text-[13px] transition-colors cursor-pointer ${
                p === page
                  ? "bg-[#308c58] text-white"
                  : "border border-[#d1d5dc] text-[#514f4f] hover:bg-[#f9fafb]"
              }`}
            >
              {(p as number) + 1}
            </button>
          ),
        )}

        <button
          disabled={page === totalPages - 1}
          onClick={() => onChange(page + 1)}
          className="h-[32px] w-[32px] rounded-[6px] border border-[#d1d5dc] flex items-center justify-center text-[#514f4f] hover:bg-[#f9fafb] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
