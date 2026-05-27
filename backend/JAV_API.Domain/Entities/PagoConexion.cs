namespace JAV_API.Domain.Entities;

// Tabla puente N-N entre Conexion y Pago
public class PagoConexion
{
    public int IdConexion { get; set; }
    public Conexion Conexion { get; set; } = null!;

    public int IdPago { get; set; }
    public Pago Pago { get; set; } = null!;
}
