using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class Mensualidad
{
    public int IdMensualidad { get; set; }
    public int IdUsuario { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public decimal Monto { get; set; }
    public DateTime? PeriodoPago { get; set; }
    public Estado Estado { get; set; } = Estado.Pendiente;
    public DateTime? FechaVencimiento { get; set; }

    // Relaciones
    public ICollection<PagoMensualidad> PagoMensualidades { get; set; } = new List<PagoMensualidad>();
}
