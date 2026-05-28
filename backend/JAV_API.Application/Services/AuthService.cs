using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;

namespace JAV_API.Application.Services;

/// <summary>
/// Servicio de autenticación. Responsabilidad única (SRP): solo verifica credenciales y genera el JWT.
/// No crea usuarios ni consulta otro tipo de datos de negocio.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IConfiguration _configuration;

    // Tiempo de expiración del token en horas
    private const int TokenExpirationHours = 8;

    public AuthService(
        IUsuarioRepository usuarioRepository,
        IPasswordHasher passwordHasher,
        IConfiguration configuration)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    /// <inheritdoc/>
    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var usuario = await _usuarioRepository.ObtenerPorCorreoAsync(request.Correo);

        // Si el usuario no existe, la cuenta está inactiva o la contraseña no coincide: retornamos null.
        // Usamos el mismo mensaje de error genérico para no revelar si el correo existe (seguridad).
        if (usuario is null || !usuario.Estado || !_passwordHasher.Verify(request.Password, usuario.PasswordHash))
            return null;

        // Actualizar la marca de tiempo del último acceso
        usuario.UltimoAcceso = DateTime.UtcNow;

        var token = GenerarToken(usuario);
        var expiracion = DateTime.UtcNow.AddHours(TokenExpirationHours);

        return new LoginResponse
        {
            Token = token,
            Correo = usuario.Correo,
            NombreCompleto = $"{usuario.Persona.PrimerNombre} {usuario.Persona.PrimerApellido}",
            Rol = usuario.Rol?.ToString() ?? usuario.TipoUsuario.Nombre,
            Expiracion = expiracion
        };
    }

    // ─────────────────────────────────────────────────────────
    // Métodos privados (ayudantes internos)
    // ─────────────────────────────────────────────────────────

    /// <summary>
    /// Genera el token JWT firmado con los claims del usuario.
    /// Es privado porque solo el AuthService debe saber cómo se construye un token.
    /// </summary>
    private string GenerarToken(Domain.Entities.Usuario usuario)
    {
        var jwtSecret = _configuration["JWT_SECRET"]
            ?? throw new InvalidOperationException("JWT_SECRET no está configurado.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credenciales = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiracion = DateTime.UtcNow.AddHours(TokenExpirationHours);

        // Los claims son la información que se embebe dentro del token
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.IdUsuario.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Correo),
            new Claim(ClaimTypes.Role, usuario.Rol?.ToString() ?? usuario.TipoUsuario.Nombre),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID único por token
        };

        var tokenDescriptor = new JwtSecurityToken(
            claims: claims,
            expires: expiracion,
            signingCredentials: credenciales
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }
}
