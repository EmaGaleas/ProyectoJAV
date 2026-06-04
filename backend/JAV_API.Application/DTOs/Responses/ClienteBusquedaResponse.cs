namespace JAV_API.Application.DTOs.Responses;

public class ClienteBusquedaResponse
{
    public int IdUsuario { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Dni { get; set; } = string.Empty;
    public string Calle { get; set; } = string.Empty;
    public string Bloque { get; set; } = string.Empty;
    public int Lote { get; set; }
}