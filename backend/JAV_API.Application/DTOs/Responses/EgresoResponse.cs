namespace JAV_API.Application.DTOs.Responses;

public class EgresoResponse
{
    public int Id { get; set; }
    public string CodigoEgreso { get; set; } = string.Empty;
    public string RegistradoPor { get; set; } = string.Empty;
    public string Dni { get; set; } = string.Empty;
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string FacturaUrl { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string? AprobadoPor { get; set; }
}
