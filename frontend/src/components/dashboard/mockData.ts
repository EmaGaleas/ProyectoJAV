import type { DatosSemana, MetricasUsuarios, TransaccionResumen, EstadoTransaccionData, DesgloceIngreso } from './types';

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

export const MOCK_ESTADO_TRANSACCIONES: EstadoTransaccionData[] = [
  { estado: 'Pendiente', ingresos: 8, egresos: 5, color: '#FFF4E5' },
  { estado: 'En Proceso', ingresos: 12, egresos: 9, color: '#E6F3EC' },
  { estado: 'Rechazado', ingresos: 2, egresos: 3, color: '#F3F4F6' },
];

export const MOCK_DESGLOSE_INGRESOS: DesgloceIngreso[] = [
  { tipo: 'Multa', cantidad: 15, monto: 4500.00, color: '#E07A5F' },
  { tipo: 'Mensualidad', cantidad: 380, monto: 57000.00, color: '#308C58' },
  { tipo: 'Conexión', cantidad: 8, monto: 9600.00, color: '#2B6CB0' },
];