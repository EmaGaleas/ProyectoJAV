using JAV_API.Application.DTOs.Requests;
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
}