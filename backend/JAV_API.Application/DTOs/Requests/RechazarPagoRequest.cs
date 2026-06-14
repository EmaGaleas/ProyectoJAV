namespace JAV_API.Application.DTOs.Requests;

public class RechazarPagoRequest
{
    /// <summary>ID del usuario que rechaza el ingreso.</summary>
    public int RechazadoPor { get; set; }

    /// <summary>Motivo opcional del rechazo.</summary>
    public string? Motivo { get; set; }
}
