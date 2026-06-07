namespace JAV_API.Application.DTOs.Responses;

/// <summary>
/// Datos públicos de un usuario para devolverlos en respuestas de API.
/// Nunca expone información sensible como contraseñas o hashes.
/// </summary>
public class UsuarioResponse
{
    public int IdUsuario { get; set; }
    public string PrimerNombre { get; set; } = string.Empty;
    public string? SegundoNombre { get; set; }
    public string PrimerApellido { get; set; } = string.Empty;
    public string? SegundoApellido { get; set; }
    public string Dni { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public bool Estado { get; set; }
    public string? Rol { get; set; }
    public string TipoUsuario { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
    public DateTime UltimoAcceso { get; set; }

    /// <summary>Domicilios asignados al usuario. Solo aplica para clientes (Rol = DuenoDeCasa).</summary>
    public List<DomicilioAsignadoResponse> Domicilios { get; set; } = new();
}

