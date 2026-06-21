export type ReporteTab = 'Morosos' | 'Balance';
export type TipoBalance = 'Ingreso' | 'Egreso';

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
  codigo: string;
  fecha: string;
  tipo: TipoBalance;
  categoria: string;
  descripcion: string;
  monto: number;
}