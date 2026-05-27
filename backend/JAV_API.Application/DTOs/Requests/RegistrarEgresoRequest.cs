using JAV_API.Domain.Enums;

namespace JAV_API.Application.DTOs.Requests;

public class RegistrarEgresoRequest
{
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    // URL del archivo de evidencia (PDF/imagen) a guardar en el servidor
    public string Url { get; set; } = string.Empty;
}
