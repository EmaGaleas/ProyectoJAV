using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

/// <summary>
/// Contrato de acceso a datos para Usuario.
/// La capa de Application depende de esta abstracción, no de la implementación concreta (Principio D de SOLID).
/// </summary>
public interface IUsuarioRepository
{
    /// <summary>Obtiene un usuario por su ID, incluyendo los datos de su Persona y TipoUsuario.</summary>
    Task<Usuario?> ObtenerPorIdAsync(int id);

    /// <summary>Obtiene un usuario por su correo. Usado principalmente en el proceso de autenticación.</summary>
    Task<Usuario?> ObtenerPorCorreoAsync(string correo);

    /// <summary>Obtiene la lista completa de usuarios activos con sus datos relacionados.</summary>
    Task<IEnumerable<Usuario>> ObtenerTodosAsync();

    /// <summary>Crea una nueva Persona y su Usuario asociado en una sola operación atómica.</summary>
    Task<bool> CrearAsync(Usuario usuario);

    /// <summary>Verifica si ya existe un usuario registrado con ese correo electrónico.</summary>
    Task<bool> ExisteCorreoAsync(string correo);

    /// <summary>Verifica si ya existe una persona registrada con ese DNI.</summary>
    Task<bool> ExisteDniAsync(string dni);

    /// <summary>Verifica si ya existe un usuario registrado con ese número de teléfono.</summary>
    Task<bool> ExisteTelefonoAsync(string telefono);
}
