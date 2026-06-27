namespace JAV_API.Application.DTOs.Requests;

/// <summary>
/// Datos para cambiar la contraseña del usuario autenticado.
/// </summary>
public class CambiarContrasenaRequest
{
    /// <summary>Nueva contraseña que reemplazará a la actual.</summary>
    public string ContrasenaNueva { get; set; } = string.Empty;
}
