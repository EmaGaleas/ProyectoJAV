namespace JAV_API.Application.DTOs.Requests;

/// <summary>
/// Datos necesarios para registrar una nueva multa a un usuario.
/// </summary>
public class RegistrarMultaRequest
{
    /// <summary>ID del TipoCobro de tipo Multa que describe la infracción.</summary>
    public int IdTipoMulta { get; set; }

    /// <summary>ID del usuario al que se le asigna la multa.</summary>
    public int IdUsuario { get; set; }

    /// <summary>Monto en lempiras de la multa.</summary>
    public decimal Monto { get; set; }
}
