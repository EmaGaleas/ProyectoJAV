namespace JAV_API.Application.DTOs.Responses;

public class DetallePagoResponse
{
    public string Titular { get; set; } = string.Empty;
    public string Dni { get; set; } = string.Empty;
    public string NumeroComprobante { get; set; } = string.Empty;
    public string Calle { get; set; } = string.Empty;
    public string Bloque { get; set; } = string.Empty;
    public int Lote { get; set; }
    public string MetodoPago { get; set; } = string.Empty;
    public string? CodigoTransferencia { get; set; }
    public DateTime Fecha { get; set; }
    public string TipoPago { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public List<LineaPagoResponse> Lineas { get; set; } = new();

}