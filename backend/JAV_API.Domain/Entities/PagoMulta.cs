namespace JAV_API.Domain.Entities;

// Tabla puente N-N entre Multa y Pago
public class PagoMulta
{
    public int IdMulta { get; set; }
    public Multa Multa { get; set; } = null!;

    public int IdPago { get; set; }
    public Pago Pago { get; set; } = null!;
}
