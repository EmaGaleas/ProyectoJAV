namespace JAV_API.Application.DTOs.Responses;

public class DeudaDetalleResponse
{
    public int IdReal { get; set; } 
    public string IdVirtual { get; set; } = string.Empty;
    public string Concepto { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTime? FechaVencimiento { get; set; }
    public string Estado { get; set; } = string.Empty;
    public bool Vencida { get; set; }
    public decimal Mora { get; set; }
}