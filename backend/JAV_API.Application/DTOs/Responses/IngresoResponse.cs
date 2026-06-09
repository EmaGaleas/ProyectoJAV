namespace JAV_API.Application.DTOs.Responses;

public class IngresoResponse
{
    public int Id             { get; set; }
    public string Codigo      { get; set; } = string.Empty;
    public string TipoIngreso { get; set; } = string.Empty;
    public string Titular     { get; set; } = string.Empty;
    public string Dni         { get; set; } = string.Empty;
    public DateTime Fecha     { get; set; }
    public decimal Monto      { get; set; }
    public string Estado      { get; set; } = string.Empty;
}
