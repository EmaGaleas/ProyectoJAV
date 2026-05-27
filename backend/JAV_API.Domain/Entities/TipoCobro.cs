using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class TipoCobro
{
    public int IdTipoCobro { get; set; }
    public TipoCobroEnum Tipo { get; set; }
    public string Descripcion { get; set; } = string.Empty;

    // Relaciones
    public ICollection<HistorialCostos> HistorialCostos { get; set; } = new List<HistorialCostos>();
    public ICollection<Multa> Multas { get; set; } = new List<Multa>();
}
