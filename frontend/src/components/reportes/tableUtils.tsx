import React from 'react';

export const PAGE_SIZE = 9;
export const ROW_H    = 55;
export const MIN_W    = 900;

interface PageBtnProps {
  onClick: () => void;
  disabled: boolean;
  active?: boolean;
  children: React.ReactNode;
}

export function PageBtn({ onClick, disabled, active, children }: PageBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 cursor-pointer hover:bg-[#E6F3EC]"
      style={{
        width: 28, height: 28, fontSize: 12,
        fontWeight: active ? 700 : 500,
        background: active ? '#308C58' : 'transparent',
        color:      active ? '#fff'     : '#514f4f',
      }}
    >
      {children}
    </button>
  );
}

interface PaginationFooterProps {
  page: number;       // 1-based current page
  total: number;      // total record count
  onPage: (p: number) => void;
}

export function PaginationFooter({ page, total, onPage }: PaginationFooterProps) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safe       = Math.min(page - 1, totalPages - 1); // 0-based

  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-t border-[rgba(0,0,0,0.06)] shrink-0"
      style={{ background: '#FAFAFA' }}
    >
      <span style={{ fontSize: 11, color: '#8EBFA3', fontWeight: 600 }}>
        {total === 0
          ? 'Sin resultados'
          : `${safe * PAGE_SIZE + 1}–${Math.min((safe + 1) * PAGE_SIZE, total)} de ${total} registros`}
      </span>
      <div className="flex items-center gap-1">
        <PageBtn onClick={() => onPage(1)}          disabled={safe === 0}>«</PageBtn>
        <PageBtn onClick={() => onPage(safe)}        disabled={safe === 0}>‹</PageBtn>
        {Array.from({ length: totalPages }).map((_, i) => (
          <PageBtn key={i} onClick={() => onPage(i + 1)} disabled={false} active={i === safe}>
            {i + 1}
          </PageBtn>
        ))}
        <PageBtn onClick={() => onPage(safe + 2)}   disabled={safe === totalPages - 1}>›</PageBtn>
        <PageBtn onClick={() => onPage(totalPages)} disabled={safe === totalPages - 1}>»</PageBtn>
      </div>
    </div>
  );
}