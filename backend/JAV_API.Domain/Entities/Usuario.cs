using JAV_API.Domain.Enums;

namespace JAV_API.Domain.Entities;

public class Usuario
{
    // PK y a la vez FK hacia Persona (relación 1-1 compartiendo PK)
    public int IdUsuario { get; set; }
    public Persona Persona { get; set; } = null!;

    public string Correo { get; set; } = string.Empty;
    // Almacena exclusivamente el hash (BCrypt), nunca la contraseña en texto plano
    public string PasswordHash { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public bool Estado { get; set; } = true;
    public DateTime UltimoAcceso { get; set; }
    public DateTime FechaCreacion { get; set; }
    public Rol? Rol { get; set; }

    public int IdTipoUsuario { get; set; }
    public TipoUsuario TipoUsuario { get; set; } = null!;

    // Relaciones de negocio
    public ICollection<DomicilioUsuario> DomicilioUsuarios { get; set; } = new List<DomicilioUsuario>();
    public ICollection<Mensualidad> Mensualidades { get; set; } = new List<Mensualidad>();
    public ICollection<Multa> Multas { get; set; } = new List<Multa>();
    public ICollection<Conexion> Conexiones { get; set; } = new List<Conexion>();
    public ICollection<Pago> PagosRegistrados { get; set; } = new List<Pago>();
    public ICollection<Egreso> EgresosRegistrados { get; set; } = new List<Egreso>();
    public ICollection<Egreso> EgresosAprobados { get; set; } = new List<Egreso>();
    public ICollection<JornadaCobro> JornadasCobroEncargado { get; set; } = new List<JornadaCobro>();
    public ICollection<CierreCaja> CierresCajaFiscal { get; set; } = new List<CierreCaja>();
}
