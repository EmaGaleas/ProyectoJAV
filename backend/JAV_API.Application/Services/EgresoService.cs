using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Services;

public class EgresoService
{
    private readonly IEgresoRepository    _egresoRepository;
    private readonly IFileStorageService  _fileStorageService;

    public EgresoService(IEgresoRepository egresoRepository, IFileStorageService fileStorageService)
    {
        _egresoRepository   = egresoRepository;
        _fileStorageService = fileStorageService;
    }

    public async Task RegistrarEgresoAsync(RegistrarEgresoRequest request)
    {
        if (request.EvidenciaStream == Stream.Null || request.EvidenciaStream.Length == 0)
            throw new ArgumentException("La evidencia del gasto es obligatoria.");

        string urlEvidencia = await _fileStorageService.GuardarArchivoAsync(request.EvidenciaStream, request.EvidenciaNombre);

        var nuevoEgreso = new Egreso
        {
            RegistradoPor = request.RegistradoPor,
            Titulo        = request.Titulo,
            Descripcion   = request.Descripcion,
            Monto         = request.Monto,
            Url           = urlEvidencia,
            Fecha         = DateTime.UtcNow,
            Estado        = EstadoAprobacion.EnRevision
        };

        await _egresoRepository.RegistrarEgresoAsync(nuevoEgreso);
    }

    public async Task<IEnumerable<EgresoHistorialResponse>> ObtenerHistorialAsync()
    {
        var egresos = await _egresoRepository.ObtenerHistorialEgresosAsync();

        return egresos.Select(e => new EgresoHistorialResponse
        {
            Id            = e.IdEgreso,
            Codigo        = $"EG-{e.IdEgreso:D3}",
            RegistradoPor = $"{e.Registrador?.Persona?.PrimerNombre} {e.Registrador?.Persona?.PrimerApellido}".Trim(),
            Dni           = e.Registrador?.Persona?.Dni ?? string.Empty,
            Fecha         = e.Fecha.ToString("yyyy-MM-dd"),
            Monto         = e.Monto,
            Titulo        = e.Titulo,
            Descripcion   = e.Descripcion,
            FacturaUrl    = e.Url,
            Estado        = MapearEstado(e.Estado),
            AprobadoPor   = e.Aprobador != null
                ? $"{e.Aprobador.Persona?.PrimerNombre} {e.Aprobador.Persona?.PrimerApellido}".Trim()
                : null
        });
    }

    public async Task AprobarAsync(int id, int idAprobador)
    {
        var egreso = await _egresoRepository.ObtenerPorIdAsync(id)
            ?? throw new KeyNotFoundException($"Egreso {id} no encontrado.");

        if (egreso.Estado != EstadoAprobacion.EnRevision)
            throw new InvalidOperationException("Solo se pueden aprobar egresos en revisión.");

        egreso.Estado      = EstadoAprobacion.Aprobado;
        egreso.AprobadoPor = idAprobador;

        await _egresoRepository.ActualizarAsync(egreso);
    }

    public async Task RechazarAsync(int id, int idAprobador)
    {
        var egreso = await _egresoRepository.ObtenerPorIdAsync(id)
            ?? throw new KeyNotFoundException($"Egreso {id} no encontrado.");

        if (egreso.Estado != EstadoAprobacion.EnRevision)
            throw new InvalidOperationException("Solo se pueden rechazar egresos en revisión.");

        egreso.Estado      = EstadoAprobacion.Rechazado;
        egreso.AprobadoPor = idAprobador;

        await _egresoRepository.ActualizarAsync(egreso);
    }

    private static string MapearEstado(EstadoAprobacion estado) => estado switch
    {
        EstadoAprobacion.EnRevision => "Pendiente",
        EstadoAprobacion.Aprobado   => "Aprobado",
        EstadoAprobacion.Rechazado  => "Rechazado",
        _                           => "Pendiente"
    };
}
