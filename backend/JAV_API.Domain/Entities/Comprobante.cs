namespace JAV_API.Domain.Entities;

public class Comprobante
{
    public int IdComprobante { get; set; }
    public int IdPago { get; set; }
    public Pago Pago { get; set; } = null!;
    public int Codigo { get; set; }
    public string? Url { get; set; }
}
