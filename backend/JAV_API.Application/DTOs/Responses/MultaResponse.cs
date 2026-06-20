namespace JAV_API.Application.DTOs.Responses;

/// <summary>
/// Datos públicos de una multa para devolverlos en respuestas de API.
/// </summary>
public class MultaResponse
{
    public int     IdMulta          { get; set; }
    public int     IdTipoMulta      { get; set; }
    public string  TipoDescripcion  { get; set; } = string.Empty;
    public int     IdUsuario        { get; set; }
    public string  NombreUsuario    { get; set; } = string.Empty;
    public decimal Monto            { get; set; }
    public string  Estado           { get; set; } = string.Empty;
}
