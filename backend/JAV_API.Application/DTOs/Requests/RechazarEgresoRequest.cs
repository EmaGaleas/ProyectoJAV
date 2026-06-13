namespace JAV_API.Application.DTOs.Requests;

public class RechazarEgresoRequest
{
    /// <summary>ID del usuario que rechaza el egreso.</summary>
    public int RechazadoPor { get; set; }

    /// <summary>Motivo opcional del rechazo.</summary>
    public string? Motivo { get; set; }
}
