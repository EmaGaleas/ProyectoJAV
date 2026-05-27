namespace JAV_API.Domain.Entities;

public class JornadaCobro
{
    public int IdJornadaCobro { get; set; }
    public DateTime? Fecha { get; set; }
    public int Encargado { get; set; }
    public Usuario EncargadoUsuario { get; set; } = null!;

    // Relación 1-1 con CierreCaja
    public CierreCaja? CierreCaja { get; set; }
}
