namespace JAV_API.Application.DTOs.Requests;

/// <summary>
/// Contraseña del usuario autenticado para verificar su identidad antes de operaciones sensibles.
/// </summary>
public class VerificarIdentidadRequest
{
    public string Password { get; set; } = string.Empty;
}
