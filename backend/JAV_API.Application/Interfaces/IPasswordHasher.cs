namespace JAV_API.Application.Interfaces;

/// <summary>
/// Contrato para el servicio de hashing de contraseñas.
/// Abstrae la librería de hashing concreta (BCrypt), facilitando el cambio de algoritmo sin afectar el negocio (Principio D de SOLID).
/// </summary>
public interface IPasswordHasher
{
    /// <summary>Genera un hash seguro a partir de una contraseña en texto plano.</summary>
    string Hash(string password);

    /// <summary>Verifica si una contraseña en texto plano coincide con un hash previamente generado.</summary>
    bool Verify(string password, string hash);
}
