import { useState, useMemo } from 'react';
import type { DashboardFilters, MetricasUsuarios, MetricasFinancieras, DatosSemana, EstadoTransaccionData, DesgloceIngreso } from './types';

// ─── TIPO PARA CATEGORÍAS DE INGRESO ──────────────────────────────────────
export interface CategoriaIngreso {
  categoria: string;
  monto: number;
  color: string;
}

// ─── DATOS SIMULADOS (Mock Data de la Junta de Agua) ───────────────────────
const MOCK_USUARIOS: MetricasUsuarios = {
  total: 450,
  activos: 380,
  inactivos: 25,
  morosos: 45,
};

const MOCK_SEMANAS: DatosSemana[] = [
  { semana: 'Semana 1', ingresos: 12500, egresos: 3200 },
  { semana: 'Semana 2', ingresos: 18000, egresos: 15000 },
  { semana: 'Semana 3', ingresos: 8400, egresos: 2100 },
  { semana: 'Semana 4', ingresos: 21000, egresos: 5400 },
];

const MOCK_CATEGORIAS_INGRESO: CategoriaIngreso[] = [
  { categoria: 'Mensualidades de Agua', monto: 38000, color: '#308C58' },
  { categoria: 'Nuevas Conexiones',     monto: 10500, color: '#2B6CB0' },
  { categoria: 'Multas e Infracciones', monto: 3400,  color: '#E07A5F' }
];

const MOCK_ESTADO_TRANSACCIONES: EstadoTransaccionData[] = [
  { estado: 'Pendiente', ingresos: 8, egresos: 5, color: '#FFF4E5' },
  { estado: 'En Proceso', ingresos: 12, egresos: 9, color: '#E6F3EC' },
  { estado: 'Rechazado', ingresos: 2, egresos: 3, color: '#F3F4F6' },
];

const MOCK_DESGLOSE_INGRESOS: DesgloceIngreso[] = [
  { tipo: 'Multa', cantidad: 15, monto: 4500.00, color: '#E07A5F' },
  { tipo: 'Mensualidad', cantidad: 380, monto: 57000.00, color: '#308C58' },
  { tipo: 'Conexión', cantidad: 8, monto: 9600.00, color: '#2B6CB0' },
];

// ─── HOOK PERSONALIZADO ───────────────────────────────────────────────────
export function useDashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  const metricasFinancieras = useMemo<MetricasFinancieras>(() => {
    const ingresos = MOCK_SEMANAS.reduce((acc, curr) => acc + curr.ingresos, 0);
    const egresos = MOCK_SEMANAS.reduce((acc, curr) => acc + curr.egresos, 0);
    
    return {
      ingresosTotales: ingresos,
      egresosTotales: egresos,
      balanceNeto: ingresos - egresos,
      tasaMorosidad: MOCK_USUARIOS.total > 0 
        ? (MOCK_USUARIOS.morosos / MOCK_USUARIOS.total) * 100 
        : 0,
    };
  }, [filters]);

  const maxValueBars = useMemo<number>(() => {
    const maxVal = Math.max(...MOCK_SEMANAS.flatMap(s => [s.ingresos, s.egresos]));
    return maxVal > 0 ? maxVal * 1.1 : 1; 
  }, []);

  const handleFilterChange = (key: keyof DashboardFilters, value: number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    filters,
    setFilters,
    handleFilterChange,
    usuarios: MOCK_USUARIOS,
    metricasFinancieras,
    datosSemanales: MOCK_SEMANAS,
    categoriasIngreso: MOCK_CATEGORIAS_INGRESO,
    maxValueBars,
    estadoTransacciones: MOCK_ESTADO_TRANSACCIONES,
    desgloceIngresos: MOCK_DESGLOSE_INGRESOS,
  };
}