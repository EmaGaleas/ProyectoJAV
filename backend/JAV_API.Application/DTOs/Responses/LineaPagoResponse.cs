namespace JAV_API.Application.DTOs.Responses;

public class LineaPagoResponse
{
    public string Concepto { get; set; } = string.Empty;
    public DateTime? FechaVencimiento { get; set; }
    public decimal MontoBase { get; set; }
    public decimal Mora { get; set; }
    public string Tipo { get; set; } = string.Empty;
}
