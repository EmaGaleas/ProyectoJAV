import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import type { 
  DashboardFilters, 
  MetricasUsuarios, 
  MetricasFinancieras, 
  DatosSemana, 
  EstadoTransaccionData, 
  DesgloceIngreso 
} from './types';

// Definimos la interfaz de la respuesta que viene directamente del Backend (C# DTO)
interface DashboardApiResponse {
  metricasFinancieras: MetricasFinancieras;
  usuarios: MetricasUsuarios;
  datosSemanales: DatosSemana[];
  estadoTransacciones: EstadoTransaccionData[];
  desgloceIngresos: DesgloceIngreso[];
}

export function useDashboard() {
  // Inicializar filtros con el mes y año actual
  const [filters, setFilters] = useState<DashboardFilters>({
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  // Estados para manejar los datos asíncronos de la API
  const [data, setData] = useState<DashboardApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Efecto que se dispara cada vez que cambia el mes o el año seleccionado
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // NOTA: Ajusta la URL base si utilizas un cliente de Axios configurado globalmente (ej. api.get(...))
        const response = await axios.get<DashboardApiResponse>('http://localhost:5209/api/Dashboard/resumen', {
          params: {
            mes: filters.mes,
            anio: filters.anio
          }
        });
        
        setData(response.data);
      } catch (err: any) {
        console.error("Error cargando la información del Dashboard:", err);
        setError(err.response?.data?.mensaje || "No se pudo sincronizar la información con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filters.mes, filters.anio]);

  // Fallbacks de datos seguros en estructura para evitar romper los componentes visuales durante la carga o error
  const usuarios = useMemo<MetricasUsuarios>(() => {
    return data?.usuarios || { total: 0, activos: 0, inactivos: 0, morosos: 0 };
  }, [data]);

  const metricasFinancieras = useMemo<MetricasFinancieras>(() => {
    return data?.metricasFinancieras || { ingresosTotales: 0, egresosTotales: 0, balanceNeto: 0, tasaMorosidad: 0 };
  }, [data]);

  const datosSemanales = useMemo<DatosSemana[]>(() => {
    return data?.datosSemanales || [];
  }, [data]);

  const estadoTransacciones = useMemo<EstadoTransaccionData[]>(() => {
    return data?.estadoTransacciones || [];
  }, [data]);

  const desgloceIngresos = useMemo<DesgloceIngreso[]>(() => {
    return data?.desgloceIngresos || [];
  }, [data]);

  // Refactorización: Ahora calcula el valor máximo basándose dinámicamente en los datos de la API
  const maxValueBars = useMemo<number>(() => {
    if (datosSemanales.length === 0) return 1;
    const maxVal = Math.max(...datosSemanales.flatMap(s => [s.ingresos, s.egresos]));
    return maxVal > 0 ? maxVal * 1.1 : 1; 
  }, [datosSemanales]);

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
    usuarios,
    metricasFinancieras,
    datosSemanales,
    maxValueBars,
    estadoTransacciones,
    desgloceIngresos,
    loading,
    error
  };
}