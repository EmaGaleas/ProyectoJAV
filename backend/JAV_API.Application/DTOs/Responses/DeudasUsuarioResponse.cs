namespace JAV_API.Application.DTOs.Responses;

public class DeudasUsuarioResponse
{
    public List<DeudaDetalleResponse> Mensualidades { get; set; } = new();
    public List<DeudaDetalleResponse> Multas { get; set; } = new();
    public List<DeudaDetalleResponse> Conexiones { get; set; } = new();
}   