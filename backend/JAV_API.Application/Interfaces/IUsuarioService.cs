using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

/// <summary>
/// Contrato de la lógica de gestión de usuarios.
/// Responsabilidad única (SRP): maneja solo las operaciones de negocio sobre los usuarios.
/// </summary>
public interface IUsuarioService
{
    /// <summary>Obtiene todos los usuarios activos del sistema.</summary>
    Task<IEnumerable<UsuarioResponse>> ObtenerTodosAsync();

    /// <summary>Obtiene un usuario específico por su ID.</summary>
    Task<UsuarioResponse?> ObtenerPorIdAsync(int id);

    /// <summary>
    /// Registra un nuevo usuario en el sistema. Valida que no existan duplicados de correo, DNI o teléfono,
    /// aplica el hash a la contraseña y persiste la Persona y el Usuario de forma atómica.
    /// </summary>
    Task<UsuarioResponse> CrearUsuarioAsync(RegistroUsuarioRequest request);
}
