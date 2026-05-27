namespace JAV_API.Domain.Entities;

public class TipoUsuario
{
    public int IdTipo { get; set; }
    public string Nombre { get; set; } = string.Empty;

    // Relaciones
    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    public ICollection<TipoUsuarioPermiso> TipoUsuarioPermisos { get; set; } = new List<TipoUsuarioPermiso>();
}
