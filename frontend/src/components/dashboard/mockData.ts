import type { DatosSemana, MetricasUsuarios, TransaccionResumen } from './types';

export const MOCK_DASHBOARD_DATA: TransaccionResumen[] = [
  { id: '1', codigo: 'ING-001', descripcion: 'Pago Mensualidad - Bloque A Lote 5', monto: 150.00, fecha: '2026-06-15', metodoPago: 'Efectivo', usuario: 'Sandro F.', tipo: 'Ingreso', status: 'Aprobado' },
  { id: '2', codigo: 'ING-002', descripcion: 'Nueva Conexión de Agua - Bloque C Lote 12', monto: 1200.00, fecha: '2026-06-18', metodoPago: 'Transferencia', usuario: 'Ema C.', tipo: 'Ingreso', status: 'En Revisión' },
  { id: '3', codigo: 'EGR-001', descripcion: 'Compra de Tubos PVC de Alta Presión', monto: 850.00, fecha: '2026-06-19', usuario: 'Abraham R.', tipo: 'Egreso', status: 'En Revisión' },
  { id: '4', codigo: 'EGR-002', descripcion: 'Mantenimiento de Bomba Principal', monto: 2300.00, fecha: '2026-06-10', usuario: 'Daniel F.', tipo: 'Egreso', status: 'Procesado' },
  { id: '5', codigo: 'ING-003', descripcion: 'Multa por Desperdicio - Bloque B Lote 3', monto: 300.00, fecha: '2026-06-20', metodoPago: 'Efectivo', usuario: 'Sandro F.', tipo: 'Ingreso', status: 'Procesado' }
];
export const MOCK_USUARIOS: MetricasUsuarios = {
  total: 450,
  activos: 380,
  inactivos: 25,
  morosos: 45,
};

export const MOCK_SEMANAS: DatosSemana[] = [
  { semana: 'Semana 1', ingresos: 12500, egresos: 3200 },
  { semana: 'Semana 2', ingresos: 18000, egresos: 15000 },
  { semana: 'Semana 3', ingresos: 8400, egresos: 2100 },
  { semana: 'Semana 4', ingresos: 21000, egresos: 5400 },
];