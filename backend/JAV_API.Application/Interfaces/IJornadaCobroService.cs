using JAV_API.Application.DTOs.Request;
using JAV_API.Application.DTOs.Response;

namespace JAV_API.Application.Interfaces;

public interface IJornadaCobroService
{
    Task ActualizarFechaJornadaAsync(int idJornada, ActualizarJornadaCobroRequest request);
    Task<IEnumerable<MesFechaResponse>> ObtenerFechasMesesAsync(int anio);
}