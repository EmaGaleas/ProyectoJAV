import { useState } from "react";
import { Pencil, Check, X, Calendar } from "lucide-react";
import { INPUT_CLS, fmtDate, fmtMonto } from "../types";

interface Props {
  label: string;
  monto: number;
  fechaInicio: string;
  fechaFin: string;
  onSave?: (monto: number, fechaInicio: string, fechaFin: string) => void;
}

export function MontoCard({ label, monto, fechaInicio, fechaFin, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ monto: String(monto), fechaInicio, fechaFin });

  const handleSave = () => {
    onSave?.(Number(draft.monto), draft.fechaInicio, draft.fechaFin);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({ monto: String(monto), fechaInicio, fechaFin });
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280] mb-1">{label}</p>
          {!editing && (
            <p className="font-['Montserrat',sans-serif] text-[32px] font-semibold text-[#308c58]">
              {fmtMonto(monto)}
            </p>
          )}
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="h-[36px] px-3 rounded-[8px] border border-[#d1d5dc] text-[#514f4f] font-['Arimo',sans-serif] text-[13px] hover:bg-[#f9fafb] transition-colors cursor-pointer flex items-center gap-2"
          >
            <Pencil size={14} />
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="h-[36px] px-3 rounded-[8px] bg-[#308c58] text-white font-['Arimo',sans-serif] text-[13px] hover:bg-[#267045] transition-colors cursor-pointer flex items-center gap-2"
            >
              <Check size={14} />
              Guardar
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="h-[36px] px-3 rounded-[8px] border border-[#d1d5dc] text-[#514f4f] font-['Arimo',sans-serif] text-[13px] hover:bg-[#f9fafb] transition-colors cursor-pointer flex items-center gap-2"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Monto (Lps.)</label>
            <input
              type="number"
              value={draft.monto}
              onChange={(e) => setDraft((p) => ({ ...p, monto: e.target.value }))}
              className={INPUT_CLS}
              min="0"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[150px]">
            <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Fecha inicio</label>
            <input
              type="date"
              value={draft.fechaInicio}
              onChange={(e) => setDraft((p) => ({ ...p, fechaInicio: e.target.value }))}
              className={INPUT_CLS}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[150px]">
            <label className="font-['Arimo',sans-serif] text-[13px] text-[#6b7280]">Fecha fin</label>
            <input
              type="date"
              value={draft.fechaFin}
              onChange={(e) => setDraft((p) => ({ ...p, fechaFin: e.target.value }))}
              className={INPUT_CLS}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-2">
          <Calendar size={15} className="text-[#6b7280]" />
          <span className="font-['Arimo',sans-serif] text-[14px] text-[#6b7280]">
            {fmtDate(fechaInicio)} — {fmtDate(fechaFin)}
          </span>
        </div>
      )}
    </div>
  );
}
