import * as XLSX from 'xlsx';
import type { MorosoRecord, BalanceRecord } from './typesReportes';

function download(wb: XLSX.WorkBook, fileName: string) {
  XLSX.writeFile(wb, fileName);
}

export function exportMorosos(records: MorosoRecord[]) {
  const rows = records.map(r => ({
    'Residente':       r.residente,
    'DNI':             r.dni,
    'Bloque':          r.ubicacion.bloque,
    'Lote':            r.ubicacion.lote,
    'Calle':           r.ubicacion.calle,
    'Meses de Atraso': r.mesesAtraso,
    'Detalle de Deuda': r.detalleDeuda,
    'Monto Total (L.)': r.montoTotal,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Morosidad');

  // Anchos de columna aproximados
  ws['!cols'] = [
    { wch: 28 }, { wch: 18 }, { wch: 8 }, { wch: 8 },
    { wch: 16 }, { wch: 16 }, { wch: 28 }, { wch: 16 },
  ];

  const date = new Date().toISOString().split('T')[0];
  download(wb, `Reporte_Morosidad_${date}.xlsx`);
}

export function exportBalance(records: BalanceRecord[]) {
  const rows = records.map(r => ({
    'Código':      r.codigo,
    'Fecha':       r.fecha,
    'Tipo':        r.tipo,
    'Categoría':   r.categoria,
    'Descripción': r.descripcion,
    'Monto (L.)':  r.monto,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Balance General');

  ws['!cols'] = [
    { wch: 12 }, { wch: 12 }, { wch: 10 },
    { wch: 18 }, { wch: 36 }, { wch: 14 },
  ];

  const date = new Date().toISOString().split('T')[0];
  download(wb, `Reporte_Balance_${date}.xlsx`);
}