using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Services;

public class EgresoService
{
    private readonly IEgresoRepository _egresoRepository;
    private readonly IFileStorageService _fileStorageService;

    public EgresoService(IEgresoRepository egresoRepository, IFileStorageService fileStorageService)
    {
        _egresoRepository = egresoRepository;
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

    public async Task<IEnumerable<EgresoResponse>> ObtenerHistorialEgresosAsync()
    {
        var egresos = await _egresoRepository.ObtenerHistorialEgresosAsync();
        return egresos.Select(MapToResponse);
    }

    public async Task AprobarEgresoAsync(int id, int aprobadoPor)
    {
        await _egresoRepository.AprobarEgresoAsync(id, aprobadoPor);
    }

    public async Task RechazarEgresoAsync(int id)
    {
        await _egresoRepository.RechazarEgresoAsync(id);
    }

    private static EgresoResponse MapToResponse(Egreso e)
    {
        var nombreRegistrador = $"{e.Registrador.Persona.PrimerNombre} {e.Registrador.Persona.PrimerApellido}";
        string? nombreAprobador = e.Aprobador is not null
            ? $"{e.Aprobador.Persona.PrimerNombre} {e.Aprobador.Persona.PrimerApellido}"
            : null;

        return new EgresoResponse
        {
            Id            = e.IdEgreso,
            CodigoEgreso  = $"EG-{e.IdEgreso:D3}",
            RegistradoPor = nombreRegistrador,
            Dni           = e.Registrador.Persona.Dni,
            Titulo        = e.Titulo,
            Descripcion   = e.Descripcion,
            Monto         = e.Monto,
            Fecha         = e.Fecha,
            FacturaUrl    = e.Url,
            Estado        = e.Estado.ToString(),
            AprobadoPor   = nombreAprobador,
        };
    }
}