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
    /// <param name="request">Datos del nuevo usuario.</param>
    /// <param name="rolSolicitante">Rol del usuario autenticado que hace la solicitud (extraído del JWT).</param>
    Task<UsuarioResponse> CrearUsuarioAsync(RegistroUsuarioRequest request, string rolSolicitante);

    /// <summary>Obtiene el perfil completo del usuario autenticado.</summary>
    Task<UsuarioResponse?> ObtenerPerfilAsync(int idUsuario);

    /// <summary>
    /// Actualiza el correo y el teléfono del usuario autenticado.
    /// Valida que el nuevo correo/teléfono no estén en uso por otro usuario.
    /// </summary>
    Task ActualizarContactoAsync(int idUsuario, ActualizarContactoRequest request);

    /// <summary>Cambia la contraseña del usuario autenticado.</summary>
    Task CambiarContrasenaAsync(int idUsuario, CambiarContrasenaRequest request);

    /// <summary>
    /// Verifica que la contraseña proporcionada coincida con la del usuario autenticado.
    /// Lanza <see cref="UnauthorizedAccessException"/> si no coincide.
    /// </summary>
    Task VerificarIdentidadAsync(int idAdmin, string password);

    /// <summary>
    /// Edita todos los campos de la Persona y el Usuario con el ID indicado.
    /// Valida duplicados excluyendo al propio usuario.
    /// </summary>
    Task<UsuarioResponse> EditarUsuarioAsync(int id, EditarUsuarioRequest request);
}
