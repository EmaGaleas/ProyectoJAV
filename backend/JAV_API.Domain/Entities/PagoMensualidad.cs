namespace JAV_API.Domain.Entities;

// Tabla puente N-N entre Mensualidad y Pago
public class PagoMensualidad
{
    public int IdMensualidad { get; set; }
    public Mensualidad Mensualidad { get; set; } = null!;

    public int IdPago { get; set; }
    public Pago Pago { get; set; } = null!;
}
