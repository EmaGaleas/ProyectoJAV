namespace JAV_API.Domain.Entities;

// Tabla puente con PK compuesta de 3 campos: (IdUsuario, IdDomicilio, Estructura)
public class DomicilioUsuario
{
    public int IdUsuario { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public int IdDomicilio { get; set; }
    public Domicilio Domicilio { get; set; } = null!;

    public int Estructura { get; set; }
    public bool Estado { get; set; } = true;
}
