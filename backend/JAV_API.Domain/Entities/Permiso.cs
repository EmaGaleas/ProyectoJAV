namespace JAV_API.Domain.Entities;

public class Permiso
{
    public int IdPermiso { get; set; }
    public string Descripcion { get; set; } = string.Empty;

    // Relaciones
    public ICollection<TipoUsuarioPermiso> TipoUsuarioPermisos { get; set; } = new List<TipoUsuarioPermiso>();
}
