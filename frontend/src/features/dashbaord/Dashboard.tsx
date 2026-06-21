import { useDashboard } from '../../components/dashboard/useDashboard';
import { KpiCard } from '../../components/dashboard/DashboardTables';
import { WeeklyBarChart, UsersDonutChart, TransactionStatusChart, IncomeBreakdownChart, IncomeMonetaryCard } from '../../components/dashboard/DashboardCharts';

export default function Dashboard() {
  const {
    metricasFinancieras,
    usuarios,
    datosSemanales,
    maxValueBars,
    estadoTransacciones,
    desgloceIngresos,
  } = useDashboard();

  const fmtLps = (val: number) => `L. ${val.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    
    <div className="bg-[#f7f7f7] min-h-screen font-['Arimo',sans-serif] pt-0">
      
      {/* Encabezado */}
      <div className="bg-[#F2F2F2] px-3 py-0 pt-0 border-b border-[#d6eed0]">
        <h1 className="font-['Montserrat',sans-serif] font-semibold text-[#1a1a1a] text-[24px] mb-1">
          Resumen Gerencial
        </h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        
        {/* Sección 1: Indicadores Financieros */}
        <div>
          <h2 className="text-[14px] font-semibold text-[#1a1a1a] mb-4  tracking-wide text-[#6b7280]">
            Indicadores Financieros
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
              label="Ingresos del Mes" 
              value={fmtLps(metricasFinancieras.ingresosTotales)} 
              subtext="Total recaudado en el mes actual"
              textColor="#16a34a"
               
            />
            <KpiCard 
              label="Egresos del Mes" 
              value={fmtLps(metricasFinancieras.egresosTotales)} 
              subtext="Gastos operativos ejecutados" 
              textColor="#8C3F40"
            />
            <KpiCard 
              label="Balance Mensual" 
              value={fmtLps(metricasFinancieras.balanceNeto)} 
              subtext="Diferencia de fondos" 
            />
            <KpiCard 
              label="Tasa de Morosidad" 
              value={`${metricasFinancieras.tasaMorosidad.toFixed(2)}%`} 
              subtext="Basado en el padrón total" 
              textColor={metricasFinancieras.tasaMorosidad > 20 ? '#8C3F40' : '#16a34a'}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e5e7eb]"></div>

        {/* Sección 2: Gestión de Usuarios */}
        <div>
          <h2 className="text-[14px] font-semibold text-[#1a1a1a] mb-4  tracking-wide text-[#6b7280]">
            Gestión de Usuarios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#16a34a] flex items-center justify-center text-[#fff] font-semibold text-lg">
                {usuarios.activos}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Dueños de Casa Activos</p>
                <p className="text-sm text-[#374151]">Al día con sus pagos</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#8C3F40] flex items-center justify-center text-[#fff] font-semibold text-lg">
                {usuarios.morosos}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Dueños de Casa en Mora</p>
                <p className="text-sm text-[#374151]">Con 1 o más meses de retraso en pagos</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-[#e5e7eb] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#6b7280] flex items-center justify-center text-[#fff] font-semibold text-lg">
                {usuarios.inactivos}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">Usuarios Inactivos</p>
                <p className="text-sm text-[#374151]">Cuentas suspendidas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e5e7eb]"></div>

        {/* Sección 3: Flujo y Distribución */}
        <div>
          <h2 className="text-[14px] font-semibold text-[#1a1a1a] mb-4  tracking-wide text-[#6b7280]">
            Análisis Operacional
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <WeeklyBarChart data={datosSemanales} maxVal={maxValueBars} />
            </div>
            <div className="lg:col-span-2">
              <UsersDonutChart usuarios={usuarios} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e5e7eb]"></div>

        {/* Sección 4: Análisis de Ingresos */}
        <div>
          <h2 className="text-[14px] font-semibold text-[#1a1a1a] mb-4  tracking-wide text-[#6b7280]">
            Desglose de Ingresos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TransactionStatusChart data={estadoTransacciones} />
            <IncomeBreakdownChart data={desgloceIngresos} />
            <IncomeMonetaryCard data={desgloceIngresos} />
          </div>
        </div>

      </div>
    </div>
  );
}