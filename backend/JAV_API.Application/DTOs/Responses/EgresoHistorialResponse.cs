namespace JAV_API.Application.DTOs.Responses;

public class EgresoHistorialResponse
{
    public int     Id            { get; set; }
    public string  Codigo        { get; set; } = string.Empty;
    public string  RegistradoPor { get; set; } = string.Empty;
    public string  Dni           { get; set; } = string.Empty;
    public string  Fecha         { get; set; } = string.Empty;
    public decimal Monto         { get; set; }
    public string  Titulo        { get; set; } = string.Empty;
    public string  Descripcion   { get; set; } = string.Empty;
    public string  FacturaUrl    { get; set; } = string.Empty;
    public string  Estado        { get; set; } = string.Empty;
    public string? AprobadoPor   { get; set; }
}
