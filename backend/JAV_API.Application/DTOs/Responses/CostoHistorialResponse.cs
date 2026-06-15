namespace JAV_API.Application.DTOs.Response;

public class CostoHistorialResponse
{
    public int Id { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public string FechaInicio { get; set; } = string.Empty;
    public string FechaFin { get; set; } = string.Empty;
    public string EditadoPor { get; set; } = string.Empty; // Nombre o correo del usuario
    public string EditadoEl { get; set; } = string.Empty;
}