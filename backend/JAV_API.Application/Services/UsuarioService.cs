using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;

namespace JAV_API.Application.Services;

/// <summary>
/// Servicio de gestión de usuarios. Responsabilidad única (SRP): orquesta la lógica de negocio
/// para crear y consultar usuarios, delegando el acceso a datos al repositorio y el hashing al hasher.
/// </summary>
public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UsuarioService(IUsuarioRepository usuarioRepository, IPasswordHasher passwordHasher)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<UsuarioResponse>> ObtenerTodosAsync()
    {
        var usuarios = await _usuarioRepository.ObtenerTodosAsync();
        return usuarios.Select(MapearAResponse);
    }

    /// <inheritdoc/>
    public async Task<UsuarioResponse?> ObtenerPorIdAsync(int id)
    {
        var usuario = await _usuarioRepository.ObtenerPorIdAsync(id);
        return usuario is null ? null : MapearAResponse(usuario);
    }

    /// <inheritdoc/>
    public async Task<UsuarioResponse> CrearUsuarioAsync(RegistroUsuarioRequest request)
    {
        await ValidarDuplicadosAsync(request);

        var persona = ConstruirPersona(request);
        var usuario = ConstruirUsuario(request, persona);

        var creado = await _usuarioRepository.CrearAsync(usuario);
        if (!creado)
            throw new InvalidOperationException("No se pudo guardar el usuario en la base de datos.");

        return MapearAResponse(usuario);
    }

    // ─────────────────────────────────────────────────────────
    // Métodos privados (ayudantes internos con nombre semántico)
    // ─────────────────────────────────────────────────────────

    /// <summary>
    /// Valida que no existan duplicados de correo, DNI o teléfono antes de continuar.
    /// Si se encuentra un duplicado, lanza una excepción con un mensaje claro.
    /// </summary>
    private async Task ValidarDuplicadosAsync(RegistroUsuarioRequest request)
    {
        if (await _usuarioRepository.ExisteCorreoAsync(request.Correo))
            throw new InvalidOperationException($"El correo '{request.Correo}' ya está registrado.");

        if (await _usuarioRepository.ExisteDniAsync(request.Dni))
            throw new InvalidOperationException($"El DNI '{request.Dni}' ya está registrado.");

        if (await _usuarioRepository.ExisteTelefonoAsync(request.Telefono))
            throw new InvalidOperationException($"El teléfono '{request.Telefono}' ya está registrado.");
    }

    /// <summary>Construye la entidad Persona a partir del request del cliente.</summary>
    private static Persona ConstruirPersona(RegistroUsuarioRequest request)
    {
        return new Persona
        {
            PrimerNombre = request.PrimerNombre.Trim(),
            SegundoNombre = request.SegundoNombre?.Trim(),
            PrimerApellido = request.PrimerApellido.Trim(),
            SegundoApellido = request.SegundoApellido?.Trim(),
            Dni = request.Dni.Trim()
        };
    }

    /// <summary>Construye la entidad Usuario a partir del request, enlazándola con la Persona.</summary>
    private Usuario ConstruirUsuario(RegistroUsuarioRequest request, Persona persona)
    {
        return new Usuario
        {
            Persona = persona, // EF Core lo enlaza automáticamente (PK compartida)
            Correo = request.Correo.Trim().ToLower(),
            PasswordHash = _passwordHasher.Hash(request.Password),
            Telefono = request.Telefono.Trim(),
            Estado = true,
            FechaCreacion = DateTime.UtcNow,
            UltimoAcceso = DateTime.UtcNow,
            Rol = request.Rol,
            IdTipoUsuario = request.IdTipoUsuario
        };
    }

    /// <summary>
    /// Mapea la entidad de dominio Usuario al DTO de respuesta pública.
    /// Garantiza que nunca se exponga el PasswordHash ni datos sensibles.
    /// </summary>
    private static UsuarioResponse MapearAResponse(Usuario usuario)
    {
        return new UsuarioResponse
        {
            IdUsuario = usuario.IdUsuario,
            PrimerNombre = usuario.Persona.PrimerNombre,
            SegundoNombre = usuario.Persona.SegundoNombre,
            PrimerApellido = usuario.Persona.PrimerApellido,
            SegundoApellido = usuario.Persona.SegundoApellido,
            Dni = usuario.Persona.Dni,
            Correo = usuario.Correo,
            Telefono = usuario.Telefono,
            Estado = usuario.Estado,
            Rol = usuario.Rol?.ToString(),
            TipoUsuario = usuario.TipoUsuario?.Nombre ?? string.Empty,
            FechaCreacion = usuario.FechaCreacion,
            UltimoAcceso = usuario.UltimoAcceso
        };
    }
}
