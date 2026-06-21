export type ReporteTab = 'Morosos' | 'Balance';

export interface MorosoRecord {
  id: string;
  residente: string;
  dni: string;
  ubicacion: { bloque: string; lote: string; calle: string };
  mesesAtraso: number;
  detalleDeuda: string;
  montoTotal: number;
}

export interface BalanceRecord {
  id: string;
  fecha: string;
  tipo: 'Ingreso' | 'Egreso';
  categoria: string;
  descripcion: string;
  monto: number;
}