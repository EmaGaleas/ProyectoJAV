import { useState, useEffect } from 'react'
import axios from 'axios' // 1. Importamos axios
import type { Income } from './types'
import { L, fmtDate } from './types'
import { InvoiceDetail } from './InvoiceDetail'
import { ConfirmDialog } from '../egresos/ConfirmDialog'
import Lupa from '../../../assets/icons/sidebar/tesorero/ingresos.svg?react'

type Action = 'aprobar' | 'rechazar' | null

interface Props {
  income:    Income
  userRole:  string
  onClose:   () => void
  onApprove: (id: string) => Promise<void>
  onReject:  (id: string) => Promise<void>
}

export function IncomeDetailModal({ income, userRole, onClose, onApprove, onReject }: Props) {
  const [showInvoice,    setShowInvoice]   = useState(false)
  const [pendingAction, setPendingAction] = useState<Action>(null)
  const [isLoading,      setIsLoading]     = useState(false)

  const canAct = userRole === 'SuperAdministrador' && income.status === 'En revisión'

  const handleConfirm = async () => {
    if (!pendingAction) return
    setIsLoading(true)
    try {
      if (pendingAction === 'aprobar') await onApprove(income.id)
      else                             await onReject(income.id)
      setPendingAction(null)
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
      >
        {/* Panel */}
        <div
          className="bg-white rounded-2xl shadow-xl w-full overflow-hidden flex flex-col"
          style={{ maxWidth: 560, maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(0,0,0,0.06)] shrink-0">
            <div className="flex items-center gap-3">
              <div 
                className="flex items-center justify-center shrink-0" 
                style={{ width: 36, height: 36, background: '#308C58', borderRadius: 10 }}
              >
                <Lupa className="w-6 h-6" style={{ color: '#fff' }} />
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block' }}>
                  {showInvoice ? 'Factura' : 'Detalle de ingreso'}
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
                  {income.receiptNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={
                  income.status === 'Procesado'   ? { background: '#e6f3ec', color: '#308C58' } :
                  income.status === 'Rechazado'   ? { background: '#fde8e8', color: '#c0392b' } :
                                                    { background: '#fef9e7', color: '#b7791f' }
                }
              >
                {income.status}
              </span>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-xl hover:bg-[#F0FAF4] transition-colors"
                style={{ width: 32, height: 32, fontSize: 20, color: '#8EBFA3', fontWeight: 300 }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Cuerpo con scroll */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            {showInvoice ? (
              <InvoiceDetail
                income={income}
                onBack={() => setShowInvoice(false)}
                onApprove={async () => setPendingAction('aprobar')}
                onReject={async () => setPendingAction('rechazar')}
              />
            ) : (
              <IncomeDetail income={income} onViewInvoice={() => setShowInvoice(true)} />
            )}
          </div>

          {/* Footer — botones de acción */}
          {canAct && !showInvoice && (
            <div className="px-6 py-5 border-t border-[rgba(0,0,0,0.06)] flex gap-3">
              <button
                onClick={() => setPendingAction('rechazar')}
                className="flex-1 h-[44px] rounded-[10px] text-sm font-medium transition-colors"
                style={{ background: '#fde8e8', color: '#c0392b', border: 'none', cursor: 'pointer' }}
              >
                Rechazar ingreso
              </button>
              <button
                onClick={() => setPendingAction('aprobar')}
                className="flex-1 h-[44px] rounded-[10px] text-sm font-medium transition-colors"
                style={{ background: '#308C58', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Aprobar ingreso
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Diálogos de confirmación */}
      {pendingAction === 'aprobar' && (
        <ConfirmDialog
          title="Aprobar ingreso"
          message="¿Está seguro de que desea aprobar este ingreso? Esta acción no se puede deshacer."
          confirmLabel={isLoading ? 'Aprobando...' : 'Sí, aprobar'}
          confirmStyle="green"
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
          isLoading={isLoading}
        />
      )}

      {pendingAction === 'rechazar' && (
        <ConfirmDialog
          title="Rechazar ingreso"
          message="¿Está seguro de que desea rechazar este ingreso? Esta acción no se puede deshacer."
          confirmLabel={isLoading ? 'Rechazando...' : 'Sí, rechazar'}
          confirmStyle="red"
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

// ─── Vista de detalle ─────────────────────────────────────────────────────────

function IncomeDetail({ income, onViewInvoice }: { income: Income; onViewInvoice: () => void }) {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const isTransfer = income.payMethod?.toLowerCase().includes('transferencia');
  const hasTransferCode = !!income.transferCode;
  
  // Endpoint correcto del controlador en C#
  const receiptUrl = income.transferCode ? `/api/ingresos/${income.id}/comprobante` : null;

  // 2. Conexión Axios para descargar el archivo de forma segura enviando encabezados
  const handleDownload = async () => {
    if (!receiptUrl) return;
    setIsDownloading(true);
    try {
      const response = await axios.get(receiptUrl, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `comprobante_${income.receiptNumber || income.id}.jpg`);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza del DOM
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error descargando el comprobante:", error);
      alert("No se pudo descargar el archivo.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <DetailSection title="Datos del Sistema">
        <DetailRow label="ID de Ingreso" value={income.id} />
      </DetailSection>

      <DetailSection title="Titular de la cuenta">
        <DetailRow label="Nombre"         value={income.holderName} />
        <DetailRow label="DNI"            value={income.dni} />
        <DetailRow label="N° Recibo"       value={income.receiptNumber} />
      </DetailSection>

      <DetailSection title="Dirección">
        <div className="grid grid-cols-3 gap-3">
          <AddressField label="Calle"  value={income.street} />
          <AddressField label="Bloque" value={income.block}  />
          <AddressField label="Lote"   value={income.lot}    />
        </div>
      </DetailSection>

      <DetailSection title="Información de pago">
        <DetailRow label="Método de pago" value={income.payMethod} />
        <DetailRow label="Tipo de pago"   value={income.paymentType} />
        <DetailRow label="Fecha"          value={fmtDate(income.date)} />
        {hasTransferCode && <DetailRow label="N° Comprobante" value={income.transferCode!} />}

        {/* Botones de Comprobante si aplica transferencia */}
        {isTransfer && hasTransferCode && receiptUrl && (
          <div className="flex gap-2 mt-2 pt-3 border-t border-[rgba(0,0,0,0.06)]">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors border border-[#308C58]"
              style={{ background: '#F0FAF4', color: '#308C58' }}
            >
              Ver comprobante
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center text-center border-none"
              style={{ background: '#308C58', color: '#fff', cursor: 'pointer' }}
            >
              {isDownloading ? 'Descargando...' : 'Descargar'}
            </button>
          </div>
        )}
      </DetailSection>

      {income.lines && income.lines.length > 0 && (
        <DetailSection title="Conceptos / Líneas">
          <div className="flex flex-col gap-1.5 max-h-[150px] overflow-y-auto pr-1">
            {income.lines.map((line: any, index: number) => (
              <div 
                key={line.id || index} 
                className="flex justify-between items-center bg-white p-2 rounded-lg border border-[rgba(0,0,0,0.04)] text-[12px]"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-[#1A1A1A]">{line.concept || line.description || `Concepto ${index + 1}`}</span>
                  {line.quantity && <span className="text-[10px] text-gray-400">Cant: {line.quantity}</span>}
                </div>
                <span className="font-semibold text-[#308C58]">
                  {line.amount ? L(line.amount) : line.price ? L(line.price) : '—'}
                </span>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#F0FAF4', border: '1px solid #D5EDDF' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Monto Total</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#308C58' }}>{L(income.total)}</span>
      </div>

      {income.lines && income.lines.length > 0 && (
        <button
          onClick={onViewInvoice}
          className="w-full py-3 rounded-xl transition-colors"
          style={{ background: '#308C58', color: '#fff', fontSize: 14, fontWeight: 600 }}
        >
          Ver Factura
        </button>
      )}

      {showReceiptModal && receiptUrl && (
        <ReceiptModal 
          url={receiptUrl} 
          onClose={() => setShowReceiptModal(false)} 
        />
      )}
    </div>
  )
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span style={{ fontSize: 11, fontWeight: 700, color: '#308C58', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {title}
      </span>
      <div className="p-4 rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#FAFAFA] flex flex-col gap-2.5">
        {children}
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span style={{ fontSize: 12, color: '#8EBFA3' }}>{label}</span>
      <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  )
}

function AddressField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ fontSize: 10, fontWeight: 600, color: '#8EBFA3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <div className="px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white">
        <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500 }}>{value || '—'}</span>
      </div>
    </div>
  )
}

function ReceiptModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [blobSrc, setBlobSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  // 3. Conexión Axios para renderizar la imagen binaria de manera segura en el modal
  useEffect(() => {
    let localUrl = '';
    
    const fetchImageBlob = async () => {
      try {
        const response = await axios.get(url, { responseType: 'blob' });
        localUrl = URL.createObjectURL(response.data);
        setBlobSrc(localUrl);
      } catch (error) {
        console.error("No se pudo obtener el archivo del comprobante por Axios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageBlob();

    // Revocamos la URL local para no saturar la memoria del navegador
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [url]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden relative"
        style={{ width: '100%', maxWidth: 500, height: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.06)] shrink-0">
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>
            Comprobante de Pago
          </span>
          <div className="flex items-center gap-2">
            <button onClick={handleZoomOut} className="w-8 h-8 rounded-lg bg-[#F0FAF4] text-[#308C58] font-bold text-lg hover:bg-[#E2F1E8] transition-colors">-</button>
            <button onClick={handleZoomIn} className="w-8 h-8 rounded-lg bg-[#F0FAF4] text-[#308C58] font-bold text-lg hover:bg-[#E2F1E8] transition-colors">+</button>
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg text-gray-500 text-xl font-light hover:bg-gray-100 transition-colors">×</button>
          </div>
        </div>

        {/* Contenedor adaptado para mostrar loading o el blob de Axios */}
        <div className="flex-1 overflow-auto bg-[#FAFAFA] flex items-center justify-center p-4">
          {loading ? (
            <span className="text-sm text-gray-400 font-medium">Cargando comprobante...</span>
          ) : blobSrc ? (
            <img
              src={blobSrc}
              alt="Comprobante bancario"
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.2s ease-out',
                transformOrigin: 'center',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <span className="text-sm text-red-400 font-medium">Error al cargar la imagen</span>
          )}
        </div>
      </div>
    </div>
  )
}