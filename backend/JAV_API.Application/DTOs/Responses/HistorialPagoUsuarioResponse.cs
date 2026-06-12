namespace JAV_API.Application.DTOs.Responses;

/// <summary>
/// Representa un pago en el historial personal de un usuario autenticado.
/// </summary>
public class HistorialPagoUsuarioResponse
{
    public int    Id             { get; set; }
    public string Codigo         { get; set; } = string.Empty;
    public DateTime Fecha        { get; set; }
    public decimal  Monto        { get; set; }
    public string TipoPago       { get; set; } = string.Empty;   // Mensualidad, Multa o Conexión
    public string MetodoPago     { get; set; } = string.Empty;   // Efectivo o Transferencia
    public string Responsable    { get; set; } = string.Empty;   // Nombre de usuario quien hizo el pago
    public string Estado         { get; set; } = string.Empty;
}
