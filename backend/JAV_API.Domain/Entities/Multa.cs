using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class Multa
{
    public int IdMulta { get; set; }
    public int IdTipoMulta { get; set; }
    public TipoCobro TipoMulta { get; set; } = null!;
    public int IdUsuario { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public decimal Monto { get; set; }
    public Estado Estado { get; set; } = Estado.Pendiente;

    // Relaciones
    public ICollection<PagoMulta> PagoMultas { get; set; } = new List<PagoMulta>();
}
