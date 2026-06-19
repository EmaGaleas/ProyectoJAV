namespace JAV_API.Application.DTOs.Response;

public class MesFechaResponse
{
    public int Id { get; set; } // Id de la Jornada
    public string Mes { get; set; } = string.Empty; // Ej: "Enero"
    public string FechaInicio { get; set; } = string.Empty; // Formato yyyy-MM-dd
    public string FechaFin { get; set; } = string.Empty; // Formato yyyy-MM-dd (Opcional, si lo calculas en el front puedes enviarlo vacío)
}