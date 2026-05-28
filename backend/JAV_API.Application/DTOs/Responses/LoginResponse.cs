namespace JAV_API.Application.DTOs.Responses;

/// <summary>
/// Datos que se devuelven al cliente tras un login exitoso.
/// Contiene el token JWT y la información pública del usuario.
/// </summary>
public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public DateTime Expiracion { get; set; }
}
