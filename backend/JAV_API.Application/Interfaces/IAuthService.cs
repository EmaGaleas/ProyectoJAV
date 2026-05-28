using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

/// <summary>
/// Contrato de la lógica de autenticación.
/// Separa la responsabilidad de autenticar de la gestión de usuarios (Principio S de SOLID).
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Valida las credenciales del usuario y, si son correctas, retorna un LoginResponse con el JWT firmado.
    /// Retorna null si las credenciales son inválidas.
    /// </summary>
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}
