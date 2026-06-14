namespace JAV_API.Domain.Entities;

public class HistorialCostos
{
    public int IdCobro { get; set; }
    public int IdTipoCobro { get; set; }
    public TipoCobro TipoCobro { get; set; } = null!;
    public decimal Monto { get; set; }
    public DateTime? FechaEmision { get; set; }
    public DateTime? FechaAnulacion { get; set; }
    public int EditadoPor { get; set; }
    public Usuario UsuarioEditor { get; set; } = null!;
}