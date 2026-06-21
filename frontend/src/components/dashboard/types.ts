export type DashboardStatus = 'Aprobado' | 'En Revisión' | 'Procesado';

export interface DashboardFilters {
  mes: number; // 1-12
  anio: number;
}

export interface TransaccionResumen {
  id: string;
  codigo: string;
  descripcion: string;
  monto: number;
  fecha: string;
  metodoPago?: 'Efectivo' | 'Transferencia';
  usuario: string;
  tipo: 'Ingreso' | 'Egreso';
  status: DashboardStatus;
}
export interface MetricasUsuarios {
  total: number;
  activos: number;
  inactivos: number;
  morosos: number;
}
export interface MetricasResumen {
  totalIngresos: number;
  totalEgresos: number;
  balanceNeto: number;
  conteoIngresos: Record<DashboardStatus, number>;
  conteoEgresos: Record<DashboardStatus, number>;
}
export interface MetricasFinancieras {
  ingresosTotales: number;
  egresosTotales: number;
  balanceNeto: number;
  tasaMorosidad: number; // Porcentaje
}
export interface DatosSemana {
  semana: string;
  ingresos: number;
  egresos: number;
}