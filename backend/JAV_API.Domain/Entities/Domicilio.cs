using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class Domicilio
{
    public int IdDomicilio { get; set; }
    public Bloque CodigoBloque { get; set; }
    public int LoteCasa { get; set; }
    public Calle Calle { get; set; }

    // Relaciones
    public ICollection<DomicilioUsuario> DomicilioUsuarios { get; set; } = new List<DomicilioUsuario>();
    public ICollection<Conexion> Conexiones { get; set; } = new List<Conexion>();
}
