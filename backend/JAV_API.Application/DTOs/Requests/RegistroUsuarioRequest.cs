using JAV_API.Domain.Enums;

namespace JAV_API.Application.DTOs.Requests;

public class RegistroUsuarioRequest
{
    // Datos de Persona
    public string PrimerNombre { get; set; } = string.Empty;
    public string? SegundoNombre { get; set; }
    public string PrimerApellido { get; set; } = string.Empty;
    public string? SegundoApellido { get; set; }
    public string Dni { get; set; } = string.Empty;

    // Datos de Usuario
    public string Correo { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Rol? Rol { get; set; }
    public int IdTipoUsuario { get; set; }

    // Datos de Domicilio cuando sea dueno de casa
    public DomicilioRequest? Domicilio { get; set; }
}
