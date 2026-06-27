namespace JAV_API.Application.DTOs.Responses;

public class EgresoResponse
{
    public int    IdEgreso      { get; set; }
    public string CodigoEgreso  { get; set; } = string.Empty;  // "EGR-{id}"
    public string RegistradoPor { get; set; } = string.Empty;  // nombre del registrador
    public string Dni           { get; set; } = string.Empty;
    public DateTime Fecha       { get; set; }
    public decimal Monto        { get; set; }
    public string ReceptorPago  { get; set; } = string.Empty;  // Titulo del egreso
    public string Descripcion   { get; set; } = string.Empty;
    public string FacturaUrl    { get; set; } = string.Empty;  // URL del archivo
    public string Estado        { get; set; } = string.Empty;  // "Aprobado" | "Pendiente" | "Rechazado"
    public string? AprobadoPor  { get; set; }                  // nombre del aprobador
    public string? ComentarioRechazo { get; set; }
}
