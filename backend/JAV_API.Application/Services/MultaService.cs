using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Services;

/// <summary>
/// Servicio de lógica de negocio para el módulo de Multas.
/// </summary>
public class MultaService : IMultaService
{
    private readonly IMultaRepository       _multaRepository;
    private readonly ITipoCobroRepository   _tipoCobroRepository;
    private readonly IUsuarioRepository     _usuarioRepository;

    public MultaService(
        IMultaRepository     multaRepository,
        ITipoCobroRepository tipoCobroRepository,
        IUsuarioRepository   usuarioRepository)
    {
        _multaRepository     = multaRepository;
        _tipoCobroRepository = tipoCobroRepository;
        _usuarioRepository   = usuarioRepository;
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<MultaResponse>> ObtenerTodosAsync()
    {
        var multas = await _multaRepository.ObtenerTodosAsync();
        return multas.Select(MapearAResponse);
    }

    /// <inheritdoc/>
    public async Task<MultaResponse> RegistrarAsync(RegistrarMultaRequest request)
    {
        // Validar que el TipoCobro exista y sea de tipo Multa
        var tipoCobro = await _tipoCobroRepository.ObtenerPorIdAsync(request.IdTipoMulta)
            ?? throw new InvalidOperationException($"No existe un TipoCobro con ID {request.IdTipoMulta}.");

        if (tipoCobro.Tipo != TipoCobroEnum.Multa)
            throw new InvalidOperationException(
                $"El TipoCobro '{tipoCobro.Descripcion}' es de tipo '{tipoCobro.Tipo}', no de tipo 'Multa'.");

        // Validar que el usuario exista
        var usuario = await _usuarioRepository.ObtenerPorIdAsync(request.IdUsuario)
            ?? throw new InvalidOperationException($"No existe un usuario con ID {request.IdUsuario}.");

        if (request.Monto <= 0)
            throw new InvalidOperationException("El monto de la multa debe ser mayor a cero.");

        var multa = new Multa
        {
            IdTipoMulta = request.IdTipoMulta,
            IdUsuario   = request.IdUsuario,
            Monto       = request.Monto,
            Estado      = Estado.Pendiente
        };

        await _multaRepository.CrearAsync(multa);

        // Recargar con relaciones para mapear correctamente
        var creada = await _multaRepository.ObtenerPorIdAsync(multa.IdMulta)
            ?? throw new InvalidOperationException("Error al recuperar la multa recién creada.");

        return MapearAResponse(creada);
    }

    /// <inheritdoc/>
    public async Task AnularAsync(int id)
    {
        var multa = await _multaRepository.ObtenerPorIdAsync(id)
            ?? throw new KeyNotFoundException($"No existe una multa con ID {id}.");

        if (multa.Estado == Estado.Anulado)
            throw new InvalidOperationException($"La multa con ID {id} ya se encuentra anulada.");

        await _multaRepository.AnularAsync(id);
    }

    // ── Helpers ─────────────────────────────────────────────
    private static MultaResponse MapearAResponse(Multa m) => new()
    {
        IdMulta         = m.IdMulta,
        IdTipoMulta     = m.IdTipoMulta,
        TipoDescripcion = m.TipoMulta?.Descripcion ?? string.Empty,
        IdUsuario       = m.IdUsuario,
        NombreUsuario   = m.Usuario is null ? string.Empty
                          : $"{m.Usuario.Persona.PrimerNombre} {m.Usuario.Persona.PrimerApellido}",
        Monto           = m.Monto,
        Estado          = m.Estado.ToString()
    };
}
