import type { Income, InvoiceLine } from './data/mockdata'
import { L, fmtDate } from './data/mockdata'
import { useAuthStore } from '../../auth/store/authStore';
import { useState } from 'react';

interface Props {
  income: Income
  onBack: () => void
}
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Procesado':   { bg: '#EBF5EF', color: '#308C58' },
  'En revisión': { bg: '#FEF9EC', color: '#B45309' },
  'Rechazado':   { bg: '#FEF2F2', color: '#DC2626' },
}

export function InvoiceDetail({ income, onBack }: Props) {
  const mensualidades = income.lines.filter(l => l.type === 'mensualidad')
  const multas        = income.lines.filter(l => l.type === 'multa')
  const {user} = useAuthStore();
  const isSuperAdmin = user?.rol === "SuperAdministrador";
  const [status, setStatus] = useState(income.status);
  

  console.log(income)


    const handleAccept = () => {
      console.log("Aceptar")
      setStatus("Procesado");
      income.status = "Procesado";
    }
    const handleReject = () => {
      console.log("Rechazar")
      setStatus("Rechazado");
      income.status = "Rechazado";
    }

  return (
    <div className="flex flex-col gap-5">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span style={{ fontSize: 11, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            Detalle de factura
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A' }}>
            {income.receiptNumber}
          </span>
        </div>
        <div className='flex gap-2'>
        <StatusBadge status={status} />
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgba(0,0,0,0.1)] hover:bg-[#F8FDFB] transition-colors"
          style={{ fontSize: 12, fontWeight: 600, color: '#308C58' }}
        >
          ← Volver al detalle
        </button>
        </div>
        
      </div>

      {/* Titular y método */}
      <InfoCard>
        <InfoRow label="Titular"    value={income.holderName} />
        <InfoRow label="Dirección"  value={`${income.street}, ${income.block}, ${income.lot}`} />
        <InfoRow label="Fecha pago" value={fmtDate(income.date)} />
        <InfoRow label="Método"     value={income.payMethod} />
        {income.transferCode && <InfoRow label="Comprobante" value={income.transferCode} />}
      </InfoCard>

      {/* Mensualidades */}
      {mensualidades.length > 0 && (
        <InvoiceSection title="Mensualidades" lines={mensualidades} />
      )}

      {/* Multas */}
      {multas.length > 0 && (
        <InvoiceSection title="Multas" lines={multas} />
      )}

      {/* Total */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#F0FAF4', border: '1px solid #D5EDDF' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Total pagado</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#308C58' }}>{L(income.total)}</span>
      </div>
      {isSuperAdmin && status === "En revisión" &&(
        <div className="flex items-center justify-between px-4 py-3 " >
          <button className='bg-green-700 text-white p-2 rounded-xl w-2/5' onClick={handleAccept}>Aceptar</button>
          <button className='bg-red-700 text-white p-2 rounded-xl w-2/5' onClick={handleReject}>Rechazar</button>
        </div>
      )}
    </div>
  )
}

// ─── sub-componentes locales ──────────────────────────────────────────────────

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#FAFAFA]">
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span style={{ fontSize: 12, color: '#8EBFA3', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function InvoiceSection({ title, lines }: { title: string; lines: InvoiceLine[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span style={{ fontSize: 11, fontWeight: 700, color: '#308C58', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {title}
      </span>
      <div className="rounded-xl border border-[rgba(0,0,0,0.07)] overflow-hidden">
        {/* Header */}
        <div className="grid px-4 py-2 border-b border-[rgba(0,0,0,0.06)]" style={{ gridTemplateColumns: '1fr 90px 90px 90px', background: '#FAFAFA' }}>
          {['Concepto', 'Vencimiento', 'Monto base', 'Mora'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#8EBFA3', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {/* Filas */}
        {lines.map((line, i) => (
          <div
            key={line.id}
            className="grid px-4 py-3"
            style={{
              gridTemplateColumns: '1fr 90px 90px 90px',
              borderBottom: i < lines.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
            }}
          >
            <span style={{ fontSize: 12, color: '#1A1A1A' }}>{line.concept}</span>
            <span style={{ fontSize: 12, color: '#8EBFA3' }}>{fmtDate(line.dueDate)}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A' }}>{L(line.baseAmount)}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: line.mora > 0 ? '#EF4444' : '#8EBFA3' }}>
              {line.mora > 0 ? L(line.mora) : '0.00'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE['En revisión']
  return (
    <span className="rounded-full whitespace-nowrap flex items-center"
      style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', background: s.bg, color: s.color }}>
      {status}
    </span>
  )
}