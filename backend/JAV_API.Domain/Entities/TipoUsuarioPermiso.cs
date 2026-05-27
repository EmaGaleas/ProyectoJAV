namespace JAV_API.Domain.Entities;

// Tabla puente N-N entre TipoUsuario y Permiso
public class TipoUsuarioPermiso
{
    public int IdTipo { get; set; }
    public TipoUsuario TipoUsuario { get; set; } = null!;

    public int IdPermiso { get; set; }
    public Permiso Permiso { get; set; } = null!;
}
