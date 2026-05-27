using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class Egreso
{
    public int IdEgreso { get; set; }
    public int RegistradoPor { get; set; }
    public Usuario Registrador { get; set; } = null!;
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string Url { get; set; } = string.Empty;
    public EstadoAprobacion Estado { get; set; } = EstadoAprobacion.EnRevision;
    public int AprobadoPor { get; set; }
    public Usuario Aprobador { get; set; } = null!;
}
