using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class Pago
{
    public int IdPago { get; set; }
    public int? RegistradoPor { get; set; }
    public Usuario? Registrador { get; set; }
    public MetodoPago MetodoPago { get; set; }
    // Usamos decimal para precisión financiera (el DBML dice integer, acordamos usar decimal)
    public decimal Monto { get; set; }
    public DateTime FechaPago { get; set; }

    // Estado de aprobación del ingreso
    public EstadoAprobacion Estado { get; set; } = EstadoAprobacion.EnRevision;
    public int? AprobadoPor { get; set; }
    public Usuario? Aprobador { get; set; }
    public string? ComentarioRechazo { get; set; }

    // Relaciones
    public Comprobante? Comprobante { get; set; }
    public ICollection<PagoMensualidad> PagoMensualidades { get; set; } = new List<PagoMensualidad>();
    public ICollection<PagoMulta> PagoMultas { get; set; } = new List<PagoMulta>();
    public ICollection<PagoConexion> PagoConexiones { get; set; } = new List<PagoConexion>();
}
