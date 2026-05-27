using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class Conexion
{
    public int IdConexion { get; set; }
    public int IdUsuario { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public decimal Monto { get; set; }
    public int IdDomicilio { get; set; }
    public Domicilio Domicilio { get; set; } = null!;
    public Estado Estado { get; set; } = Estado.Pendiente;

    // Relaciones
    public ICollection<PagoConexion> PagoConexiones { get; set; } = new List<PagoConexion>();
}
