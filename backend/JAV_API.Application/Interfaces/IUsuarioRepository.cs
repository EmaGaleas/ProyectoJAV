using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Interfaces;

/// <summary>
/// Contrato de acceso a datos para Usuario.
/// La capa de Application depende de esta abstracción, no de la implementación concreta (Principio D de SOLID).
/// </summary>
public interface IUsuarioRepository
{
    /// <summary>Obtiene un usuario por su ID, incluyendo los datos de su Persona, TipoUsuario y Domicilios.</summary>
    Task<Usuario?> ObtenerPorIdAsync(int id);

    /// <summary>Obtiene un usuario por su correo. Usado principalmente en el proceso de autenticación.</summary>
    Task<Usuario?> ObtenerPorCorreoAsync(string correo);

    /// <summary>Obtiene la lista completa de usuarios activos con sus datos relacionados.</summary>
    Task<IEnumerable<Usuario>> ObtenerTodosAsync();

    /// <summary>Crea una nueva Persona y su Usuario asociado en una sola operación atómica.</summary>
    Task<bool> CrearAsync(Usuario usuario);

    /// <summary>
    /// Crea una nueva Persona, su Usuario y su DomicilioUsuario de forma atómica.
    /// Si <paramref name="nuevoDomicilio"/> no es null, también persiste ese Domicilio antes de crear la asignación.
    /// </summary>
    Task<bool> CrearConDomicilioAsync(Usuario usuario, DomicilioUsuario domicilioUsuario, Domicilio? nuevoDomicilio);

    /// <summary>Verifica si ya existe un usuario registrado con ese correo electrónico.</summary>
    Task<bool> ExisteCorreoAsync(string correo);

    /// <summary>Verifica si ya existe una persona registrada con ese DNI.</summary>
    Task<bool> ExisteDniAsync(string dni);

    /// <summary>Verifica si ya existe un usuario registrado con ese número de teléfono.</summary>
    Task<bool> ExisteTelefonoAsync(string telefono);

    /// <summary>Obtiene la cantidad de usuarios activos (Estado = true) que poseen un rol determinado.</summary>
    Task<int> ObtenerCantidadActivosPorRolAsync(Rol rol);

    /// <summary>Obtiene un Domicilio por su ID. Devuelve null si no existe.</summary>
    Task<Domicilio?> ObtenerDomicilioPorIdAsync(int idDomicilio);

    /// <summary>
    /// Verifica si ya existe un Domicilio con la combinación exacta de Bloque, LoteCasa y Calle.
    /// Usado para evitar duplicados al crear un domicilio nuevo.
    /// </summary>
    Task<bool> ExisteDomicilioAsync(Bloque bloque, int loteCasa, Calle calle);

    /// <summary>
    /// Obtiene un TipoUsuario por su nombre exacto (ej. "Cliente", "Administrador").
    /// Usado para asignar automáticamente el TipoUsuario a partir del Rol.
    /// </summary>
    Task<TipoUsuario?> ObtenerTipoUsuarioPorNombreAsync(string nombre);
}
