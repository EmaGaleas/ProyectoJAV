namespace JAV_API.Application.DTOs.Responses;

/// <summary>
/// Representa un domicilio asignado a un usuario, tal como se devuelve en la respuesta de la API.
/// </summary>
public class DomicilioAsignadoResponse
{
    public int IdDomicilio { get; set; }
    public string CodigoBloque { get; set; } = string.Empty;
    public int LoteCasa { get; set; }
    public string Calle { get; set; } = string.Empty;

    /// <summary>Tipo de estructura dentro del domicilio (parte de la PK compuesta de Domicilio_Usuario).</summary>
    public int Estructura { get; set; }

    /// <summary>Indica si la asignación domicilio-usuario está activa.</summary>
    public bool Estado { get; set; }
}
