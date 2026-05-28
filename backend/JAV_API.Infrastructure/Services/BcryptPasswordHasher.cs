using JAV_API.Application.Interfaces;

namespace JAV_API.Infrastructure.Services;

/// <summary>
/// Implementación concreta del hasher de contraseñas usando el algoritmo BCrypt.
/// Al depender del contrato IPasswordHasher, el resto del sistema nunca importa BCrypt directamente
/// (Principio de Inversión de Dependencias - SOLID).
/// </summary>
public class BcryptPasswordHasher : IPasswordHasher
{
    // Work factor de BCrypt: a mayor valor, más lento y más seguro. 12 es el estándar de la industria.
    private const int WorkFactor = 12;

    /// <inheritdoc/>
    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
    }

    /// <inheritdoc/>
    public bool Verify(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
