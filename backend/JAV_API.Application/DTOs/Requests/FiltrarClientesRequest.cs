namespace JAV_API.Application.DTOs.Requests;

public class FiltrarClientesRequest
{
    public string? Calle { get; set; }
    public string? Bloque { get; set; }
    public int? Lote { get; set; }
}