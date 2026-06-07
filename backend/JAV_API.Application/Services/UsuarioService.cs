using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;


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
        await ValidarReglasNegocioAsync(request);

        var persona = ConstruirPersona(request);
        var usuario = await ConstruirUsuarioAsync(request, persona);

        bool creado;

        if (request.Rol == Rol.DuenoDeCasa)
        {
            // El domicilio ya fue validado en ValidarReglasNegocioAsync
            var (domicilioUsuario, nuevoDomicilio) = ConstruirDomicilioUsuario(request.Domicilio!, usuario);
            creado = await _usuarioRepository.CrearConDomicilioAsync(usuario, domicilioUsuario, nuevoDomicilio);
        }
        else
        {
            creado = await _usuarioRepository.CrearAsync(usuario);
        }

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

    /// <summary>
    /// Valida las reglas de negocio al crear un usuario:
    /// 0. El valor del Rol debe ser un valor válido del enum.
    /// 1. Solo puede haber máximo 1 usuario activo para roles directivos/operativos,
    ///    y máximo 3 para el rol Vocal. DuenoDeCasa no tiene límite.
    /// 2. Si el Rol es DuenoDeCasa, el campo Domicilio es obligatorio y debe ser coherente.
    ///    Si el Rol NO es DuenoDeCasa, el campo Domicilio debe ser null.
    /// El TipoUsuario se asigna automáticamente según el Rol — no es necesario enviarlo.
    /// </summary>
    private async Task ValidarReglasNegocioAsync(RegistroUsuarioRequest request)
    {
        // Validación 0: El valor del Rol debe ser un valor definido en el enum
        if (request.Rol.HasValue && !Enum.IsDefined(typeof(Rol), request.Rol.Value))
            throw new InvalidOperationException(
                $"El valor de Rol '{request.Rol}' no corresponde a ningún rol válido del sistema.");

        // Validación 1: Límite de usuarios activos por rol operativo
        if (request.Rol is null || request.Rol == Rol.DuenoDeCasa)
        {
            // Validación 2 (solo para clientes): el domicilio es obligatorio
            if (request.Rol == Rol.DuenoDeCasa)
                await ValidarDomicilioRequestAsync(request.Domicilio);

            return; // Sin límite de activos para residentes
        }

        // Roles operativos no deben tener domicilio
        if (request.Domicilio is not null)
            throw new InvalidOperationException(
                $"El campo 'Domicilio' solo aplica para usuarios con Rol '{Rol.DuenoDeCasa}'. " +
                $"El rol '{request.Rol}' no permite asignar un domicilio.");

        // Límites por rol: Vocal → máximo 3, resto → máximo 1
        int limitePermitido = request.Rol == Rol.Vocal ? 3 : 1;
        int cantidadActivos = await _usuarioRepository.ObtenerCantidadActivosPorRolAsync(request.Rol.Value);

        if (cantidadActivos >= limitePermitido)
        {
            string limiteMsg = limitePermitido == 1 ? "1 usuario activo" : $"{limitePermitido} usuarios activos";
            throw new InvalidOperationException(
                $"Ya existe el máximo permitido de {limiteMsg} para el rol '{request.Rol}'.");
        }
    }

    /// <summary>
    /// Mapeo fijo Rol → nombre del TipoUsuario.
    /// Usado para asignar el TipoUsuario automáticamente al crear un usuario.
    /// </summary>
    private static readonly Dictionary<Rol, string> _tipoNombrePorRol = new()
    {
        { Rol.Presidente,     "SuperAdministrador" },
        { Rol.Vocal,          "Administrador"      },
        { Rol.Secretario,     "Administrador"      },
        { Rol.Vicepresidente, "Administrador"      },
        { Rol.Fiscal,         "Fiscal"             },
        { Rol.Tesorero,       "Tesorero"           },
        { Rol.DuenoDeCasa,    "Cliente"            },
    };

    /// <summary>
    /// Valida la coherencia del <see cref="DomicilioRequest"/>:
    /// - No puede ser null para un cliente.
    /// - Debe usar exactamente uno de los dos modos: IdDomicilio XOR (Bloque + Lote + Calle).
    /// - Si usa IdDomicilio, verifica que exista en la BD.
    /// - Si crea uno nuevo, verifica que no sea duplicado.
    /// </summary>
    private async Task ValidarDomicilioRequestAsync(DomicilioRequest? domicilio)
    {
        if (domicilio is null)
            throw new InvalidOperationException(
                "Un usuario con Rol 'DuenoDeCasa' debe tener un domicilio asignado.");

        bool usaExistente = domicilio.IdDomicilio.HasValue;
        bool usaNuevo = domicilio.CodigoBloque.HasValue || domicilio.LoteCasa.HasValue || domicilio.Calle.HasValue;

        if (usaExistente && usaNuevo)
            throw new InvalidOperationException(
                "El domicilio debe indicar solo 'IdDomicilio' (existente) OR " +
                "'CodigoBloque', 'LoteCasa' y 'Calle' (nuevo), no ambos a la vez.");

        if (!usaExistente && !usaNuevo)
            throw new InvalidOperationException(
                "Debe indicar un domicilio: envíe 'IdDomicilio' para usar uno existente, " +
                "o 'CodigoBloque', 'LoteCasa' y 'Calle' para crear uno nuevo.");

        if (domicilio.Estructura <= 0)
            throw new InvalidOperationException(
                "El campo 'Estructura' del domicilio debe ser un valor positivo.");

        if (usaExistente)
        {
            var existente = await _usuarioRepository.ObtenerDomicilioPorIdAsync(domicilio.IdDomicilio!.Value);
            if (existente is null)
                throw new InvalidOperationException(
                    $"No existe un domicilio con el ID '{domicilio.IdDomicilio.Value}'.");
        }
        else
        {
            // Validar que se proporcionaron los tres campos del nuevo domicilio
            if (!domicilio.CodigoBloque.HasValue || !domicilio.LoteCasa.HasValue || !domicilio.Calle.HasValue)
                throw new InvalidOperationException(
                    "Para crear un domicilio nuevo debe proporcionar 'CodigoBloque', 'LoteCasa' y 'Calle'.");

            bool duplicado = await _usuarioRepository.ExisteDomicilioAsync(
                domicilio.CodigoBloque.Value, domicilio.LoteCasa.Value, domicilio.Calle.Value);

            if (duplicado)
                throw new InvalidOperationException(
                    $"Ya existe un domicilio con Bloque '{domicilio.CodigoBloque}', " +
                    $"Lote '{domicilio.LoteCasa}' y Calle '{domicilio.Calle}'.");
        }
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

    /// <summary>
    /// Construye la entidad Usuario y asigna el TipoUsuario automáticamente según el Rol.
    /// </summary>
    private async Task<Usuario> ConstruirUsuarioAsync(RegistroUsuarioRequest request, Persona persona)
    {
        int idTipoUsuario = 0;
        if (request.Rol.HasValue && _tipoNombrePorRol.TryGetValue(request.Rol.Value, out var nombreTipo))
        {
            var tipo = await _usuarioRepository.ObtenerTipoUsuarioPorNombreAsync(nombreTipo);
            idTipoUsuario = tipo?.IdTipo ?? throw new InvalidOperationException(
                $"No se encontró el TipoUsuario '{nombreTipo}' en la base de datos. " +
                "Verifica que el seed de datos se ejecutó correctamente.");
        }

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
            IdTipoUsuario = idTipoUsuario
        };
    }

    /// <summary>
    /// Construye el <see cref="DomicilioUsuario"/> (tabla puente) y, si el request indica un domicilio
    /// nuevo, también construye la entidad <see cref="Domicilio"/> que debe persistirse primero.
    /// Precondición: <paramref name="domicilioReq"/> ya fue validado por <see cref="ValidarDomicilioRequestAsync"/>.
    /// </summary>
    private static (DomicilioUsuario domicilioUsuario, Domicilio? nuevoDomicilio)
        ConstruirDomicilioUsuario(DomicilioRequest domicilioReq, Usuario usuario)
    {
        Domicilio? nuevoDomicilio = null;
        int idDomicilio;

        if (domicilioReq.IdDomicilio.HasValue)
        {
            // Modo 1: usar domicilio existente
            idDomicilio = domicilioReq.IdDomicilio.Value;
        }
        else
        {
            // Modo 2: crear domicilio nuevo (la entidad se persistirá en el repositorio)
            nuevoDomicilio = new Domicilio
            {
                CodigoBloque = domicilioReq.CodigoBloque!.Value,
                LoteCasa     = domicilioReq.LoteCasa!.Value,
                Calle        = domicilioReq.Calle!.Value
            };
            // idDomicilio se completará por EF Core tras el insert; se enlaza vía objeto
            idDomicilio = 0; // placeholder — EF Core resolverá la FK por la referencia de navegación
        }

        var domicilioUsuario = new DomicilioUsuario
        {
            Usuario    = usuario,
            Estructura = domicilioReq.Estructura,
            Estado     = true
        };

        if (nuevoDomicilio is not null)
            domicilioUsuario.Domicilio = nuevoDomicilio;
        else
            domicilioUsuario.IdDomicilio = idDomicilio;

        return (domicilioUsuario, nuevoDomicilio);
    }

    /// <summary>
    /// Mapea la entidad de dominio Usuario al DTO de respuesta pública.
    /// Garantiza que nunca se exponga el PasswordHash ni datos sensibles.
    /// </summary>
    private static UsuarioResponse MapearAResponse(Usuario usuario)
    {
        return new UsuarioResponse
        {
            IdUsuario      = usuario.IdUsuario,
            PrimerNombre   = usuario.Persona.PrimerNombre,
            SegundoNombre  = usuario.Persona.SegundoNombre,
            PrimerApellido = usuario.Persona.PrimerApellido,
            SegundoApellido = usuario.Persona.SegundoApellido,
            Dni            = usuario.Persona.Dni,
            Correo         = usuario.Correo,
            Telefono       = usuario.Telefono,
            Estado         = usuario.Estado,
            Rol            = usuario.Rol?.ToString(),
            TipoUsuario    = usuario.TipoUsuario?.Nombre ?? string.Empty,
            FechaCreacion  = usuario.FechaCreacion,
            UltimoAcceso   = usuario.UltimoAcceso,
            Domicilios     = usuario.DomicilioUsuarios
                .Select(du => new DomicilioAsignadoResponse
                {
                    IdDomicilio  = du.IdDomicilio,
                    CodigoBloque = du.Domicilio?.CodigoBloque.ToString() ?? string.Empty,
                    LoteCasa     = du.Domicilio?.LoteCasa ?? 0,
                    Calle        = du.Domicilio?.Calle.ToString() ?? string.Empty,
                    Estructura   = du.Estructura,
                    Estado       = du.Estado
                })
                .ToList()
        };
    }
}
