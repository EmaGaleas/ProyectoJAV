import { useState, useMemo } from 'react';

// ─── 1. DEFINICIÓN DE INTERFACES (TypeScript) ─────────────────────────────────
export interface DashboardFilters {
  mes: number;
  anio: number;
}

export interface MetricasUsuarios {
  total: number;
  activos: number;
  inactivos: number;
  morosos: number;
}

export interface MetricasFinancieras {
  ingresosTotales: number;
  egresosTotales: number;
  balanceNeto: number;
  tasaMorosidad: number;
}

export interface DatosSemana {
  semana: string;
  ingresos: number;
  egresos: number;
}

export interface CategoriaIngreso {
  categoria: string;
  monto: number;
  color: string;
}

// ─── 2. DATOS SIMULADOS (Mock Data de la Junta de Agua) ───────────────────────
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
  { categoria: 'Mensualidades de Agua', monto: 38000, color: '#308C58' },   // Verde Principal
  { categoria: 'Nuevas Conexiones',     monto: 10500, color: '#2B6CB0' },   // Azul Informativo
  { categoria: 'Multas e Infracciones', monto: 3400,  color: '#E07A5F' }    // Naranja de Alerta
];

// ─── 3. HOOK PERSONALIZADO ───────────────────────────────────────────────────
export function useDashboard() {
  // Estado para controlar el mes y año actual en los filtros del panel superior
  const [filters, setFilters] = useState<DashboardFilters>({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  // Cálculos consolidados para el bloque financiero superior
  const metricasFinancieras = useMemo<MetricasFinancieras>(() => {
    const ingresos = MOCK_SEMANAS.reduce((acc, curr) => acc + curr.ingresos, 0);
    const egresos = MOCK_SEMANAS.reduce((acc, curr) => acc + curr.egresos, 0);
    
    return {
      ingresosTotales: ingresos,
      egresosTotales: egresos,
      balanceNeto: ingresos - egresos,
      // La tasa se calcula dividiendo los usuarios morosos actuales entre el padrón total
      tasaMorosidad: MOCK_USUARIOS.total > 0 
        ? (MOCK_USUARIOS.morosos / MOCK_USUARIOS.total) * 100 
        : 0,
    };
  }, [filters]);

  // Encuentra el valor más alto entre ingresos y egresos de todas las semanas.
  // Añade un 10% de holgura superior para que la barra más alta nunca toque el borde de la gráfica.
  const maxValueBars = useMemo<number>(() => {
    const maxVal = Math.max(...MOCK_SEMANAS.flatMap(s => [s.ingresos, s.egresos]));
    return maxVal > 0 ? maxVal * 1.1 : 1; 
  }, []);

  // Handler para cambiar de mes o año si decides expandir los selectores en la UI
  const handleFilterChange = (key: keyof DashboardFilters, value: number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    // Estados y setters de filtrado
    filters,
    setFilters,
    handleFilterChange,

    // Datos demográficos estructurados de usuarios
    usuarios: MOCK_USUARIOS,

    // Métricas calculadas para las tarjetas KPI
    metricasFinancieras,

    // Listado semanal para la gráfica de columnas agrupadas
    datosSemanales: MOCK_SEMANAS,

    // Desglose analítico solicitado por multas, mensualidades y conexiones
    categoriasIngreso: MOCK_CATEGORIAS_INGRESO,

    // Valor de referencia para el escalado proporcional de la UI
    maxValueBars,
  };
}