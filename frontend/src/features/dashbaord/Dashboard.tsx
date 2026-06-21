import { useDashboard } from '../../components/dashboard/useDashboard';
import { KpiCard } from '../../components/dashboard/DashboardTables';
import { WeeklyBarChart, UsersDonutChart  } from '../../components/dashboard/DashboardCharts';

export default function Dashboard() {
  const {
    metricasFinancieras,
    usuarios,
    datosSemanales,
    maxValueBars
  } = useDashboard();

  const fmtLps = (val: number) => `L. ${val.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-[#f2f2f2] pl-6 pr-6 flex flex-col gap-2 min-h-full font-['Arimo',sans-serif]">
      
      {/* ENCABEZADO */}
      <div>
        <h1 className="font-['Montserrat',sans-serif] font-bold text-[#364153] text-[24px] tracking-tight">
          Resumen Gerencial
        </h1>
        <p className="text-[13px] text-[#9fa3a5] mt-1">
          Métricas clave y estado general del sistema de agua.
        </p>
      </div>

      {/* BLOQUE 1: KPIs FINANCIEROS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          label="Ingresos del Mes" 
          value={fmtLps(metricasFinancieras.ingresosTotales)} 
          subtext="Total recaudado en el mes actual"
          isAccent 
        />
        <KpiCard 
          label="Egresos del Mes" 
          value={fmtLps(metricasFinancieras.egresosTotales)} 
          subtext="Gastos operativos ejecutados" 
        />
        <KpiCard 
          label="Balance Mensual" 
          value={fmtLps(metricasFinancieras.balanceNeto)} 
          subtext="Diferencia de fondos" 
          isAccent={metricasFinancieras.balanceNeto >= 0}
        />
        <KpiCard 
          label="Tasa de Morosidad" 
          value={`${metricasFinancieras.tasaMorosidad.toFixed(1)}%`} 
          subtext="Basado en el padrón total" 
        />
      </div>

      {/* BLOQUE 2: KPIs USUARIOS (Clientes) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E6F3EC] flex items-center justify-center text-[#308C58] font-bold text-lg">
            {usuarios.activos}
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#B0C8BA] uppercase tracking-wider">Dueños de Casa Activos</p>
            <p className="text-sm text-[#514f4f]">Al día con sus pagos</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF4E5] flex items-center justify-center text-[#E2A540] font-bold text-lg">
            {usuarios.morosos}
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#E2A540] uppercase tracking-wider">Dueños de Casa en Mora</p>
            <p className="text-sm text-[#514f4f]">Con 1 o más meses de retraso</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF] font-bold text-lg">
            {usuarios.inactivos}
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Usuarios Inactivos</p>
            <p className="text-sm text-[#514f4f]">Cuentas suspendidas</p>
          </div>
        </div>
      </div>

      {/* BLOQUE 3: GRÁFICAS VISUALES */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Gráfica de Barras ocupa el 60% del espacio en desktop */}
        <div className="lg:col-span-3">
          <WeeklyBarChart data={datosSemanales} maxVal={maxValueBars} />
        </div>
        
        {/* Gráfica de Anillo ocupa el 40% del espacio en desktop */}
        <div className="lg:col-span-2">
          <UsersDonutChart usuarios={usuarios} />
        </div>
      </div>

    </div>
  );
}