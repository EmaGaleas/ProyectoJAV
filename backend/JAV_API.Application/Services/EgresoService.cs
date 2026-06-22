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

    // Inyección de dependencias (Cumple con la 'D' de SOLID)
    public EgresoService(IEgresoRepository egresoRepository, IFileStorageService fileStorageService)
    {
        _egresoRepository = egresoRepository;
        _fileStorageService = fileStorageService;
    }

    public async Task RegistrarEgresoAsync(RegistrarEgresoRequest request)
    {
        // Dentro de RegistrarEgresoAsync...
        if (request.EvidenciaStream == Stream.Null || request.EvidenciaStream.Length == 0)
        {
            throw new ArgumentException("La evidencia del gasto es obligatoria.");
        }

        // Se pasan ambos parámetros limpios a la infraestructura
        string urlEvidencia = await _fileStorageService.GuardarArchivoAsync(request.EvidenciaStream, request.EvidenciaNombre);

        // 3. Mapear los datos hacia la Entidad de Dominio
        var nuevoEgreso = new Egreso
        {
            RegistradoPor = request.RegistradoPor,
            Titulo = request.Titulo,
            Descripcion = request.Descripcion,
            Monto = request.Monto,
            Url = urlEvidencia,
            Fecha = DateTime.UtcNow,
            Estado = EstadoAprobacion.EnRevision
        };
        // 4. Delegar el guardado a la base de datos mediante el repositorio
        await _egresoRepository.RegistrarEgresoAsync(nuevoEgreso);
    }

    public async Task AprobarEgresoAsync(int idEgreso, AprobarEgresoRequest request)
    {
        // La validación de existencia y estado la maneja el repositorio
        await _egresoRepository.AprobarAsync(idEgreso, request.AprobadoPor);
    }

    public async Task RechazarEgresoAsync(int idEgreso, RechazarEgresoRequest request)
    {
        await _egresoRepository.RechazarAsync(idEgreso, request.Motivo);
    }

    public async Task<IEnumerable<EgresoResponse>> ObtenerHistorialEgresosAsync()
    {
        var egresos = await _egresoRepository.ObtenerHistorialEgresosAsync();
        return egresos.Select(MapToEgresoResponse);
    }

    private static EgresoResponse MapToEgresoResponse(Egreso e)
    {
        var estadoDisplay = e.Estado switch
        {
            EstadoAprobacion.EnRevision => "Pendiente",
            EstadoAprobacion.Aprobado   => "Aprobado",
            EstadoAprobacion.Rechazado  => "Rechazado",
            _ => "Pendiente"
        };

        var registrador = e.Registrador?.Persona != null
            ? $"{e.Registrador.Persona.PrimerNombre} {e.Registrador.Persona.PrimerApellido}"
            : $"Usuario #{e.RegistradoPor}";

        var aprobador = e.Aprobador?.Persona != null
            ? $"{e.Aprobador.Persona.PrimerNombre} {e.Aprobador.Persona.PrimerApellido}"
            : null;

        return new EgresoResponse
        {
            IdEgreso      = e.IdEgreso,
            CodigoEgreso  = $"EGR-{e.IdEgreso:D4}",
            RegistradoPor = registrador,
            Dni           = e.Registrador?.Persona?.Dni ?? "Sin DNI",
            Fecha         = e.Fecha,
            Monto         = e.Monto,
            ReceptorPago  = e.Titulo,       // El Titulo hace de nombre del gasto/receptor
            Descripcion   = e.Descripcion,
            FacturaUrl    = e.Url,
            Estado        = estadoDisplay,
            AprobadoPor   = aprobador,
            ComentarioRechazo = e.ComentarioRechazo,
        };
    }
}