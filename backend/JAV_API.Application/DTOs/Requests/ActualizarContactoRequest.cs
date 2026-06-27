namespace JAV_API.Application.DTOs.Requests;

/// <summary>
/// Datos para actualizar el correo y teléfono del usuario autenticado.
/// </summary>
public class ActualizarContactoRequest
{
    /// <summary>Nuevo correo electrónico del usuario.</summary>
    public string Correo   { get; set; } = string.Empty;

    /// <summary>Nuevo número de teléfono del usuario.</summary>
    public string Telefono { get; set; } = string.Empty;
}
