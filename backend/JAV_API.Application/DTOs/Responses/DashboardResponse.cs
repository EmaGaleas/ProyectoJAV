namespace JAV_API.Application.DTOs.Responses;

public class DashboardResponse
{
    public MetricasFinancierasDto MetricasFinancieras { get; set; } = new();
    public MetricasUsuariosDto Usuarios { get; set; } = new();
    public List<DatosSemanaDto> DatosSemanales { get; set; } = new();
    public List<EstadoTransaccionDataDto> EstadoTransacciones { get; set; } = new();
    public List<DesgloceIngresoDto> DesgloceIngresos { get; set; } = new();
}

public class MetricasFinancierasDto
{
    public decimal IngresosTotales { get; set; }
    public decimal EgresosTotales { get; set; }
    public decimal BalanceNeto => IngresosTotales - EgresosTotales;
    public decimal TasaMorosidad { get; set; }
}

public class MetricasUsuariosDto
{
    public int Total { get; set; }
    public int Activos { get; set; }
    public int Inactivos { get; set; }
    public int Morosos { get; set; }
}

public class DatosSemanaDto
{
    public string Semana { get; set; } = string.Empty;
    public decimal Ingresos { get; set; }
    public decimal Egresos { get; set; }
}

public class EstadoTransaccionDataDto
{
    public string Estado { get; set; } = string.Empty;
    public int Ingresos { get; set; }
    public int Egresos { get; set; }
    public string Color { get; set; } = string.Empty;
}

public class DesgloceIngresoDto
{
    public string Tipo { get; set; } = string.Empty;
    public int Cantidad { get; set; }
    public decimal Monto { get; set; }
    public string Color { get; set; } = string.Empty;
}