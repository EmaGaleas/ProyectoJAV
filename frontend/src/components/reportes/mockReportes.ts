import type { MorosoRecord, BalanceRecord } from './typesReportes';

export const MOCK_MOROSOS: MorosoRecord[] = [
  { id: '1', residente: 'Carlos Fuentes Mejía',  dni: '0501-1980-12345', ubicacion: { bloque: 'B', lote: '14', calle: 'Principal'  }, mesesAtraso: 3, detalleDeuda: '3 Mensualidades',        montoTotal: 450.00 },
  { id: '2', residente: 'Ana Lidia Reyes',        dni: '0501-1992-54321', ubicacion: { bloque: 'A', lote: '05', calle: 'Los Pinos'  }, mesesAtraso: 1, detalleDeuda: '1 Mensualidad, 1 Multa', montoTotal: 450.00 },
  { id: '3', residente: 'Jorge Alberto Santos',   dni: '0511-1975-98765', ubicacion: { bloque: 'C', lote: '22', calle: 'Las Acacias' }, mesesAtraso: 5, detalleDeuda: '5 Mensualidades',        montoTotal: 750.00 },
  { id: '4', residente: 'María Fernanda Cruz',    dni: '0501-1988-11223', ubicacion: { bloque: 'B', lote: '02', calle: 'Principal'  }, mesesAtraso: 2, detalleDeuda: '2 Mensualidades',        montoTotal: 300.00 },
];

export const MOCK_BALANCE: BalanceRecord[] = [
  { id: '1', codigo: 'ING-001', fecha: '2026-06-15', tipo: 'Ingreso', categoria: 'Mensualidad',   descripcion: 'Pago Mensualidad - Bloque A Lote 5', monto: 150.00 },
  { id: '2', codigo: 'EGR-001', fecha: '2026-06-19', tipo: 'Egreso',  categoria: 'Mantenimiento', descripcion: 'Compra de Tubos PVC',                monto: 850.00 },
];