using JAV_API.Application.DTOs.Request;

namespace JAV_API.Application.Interfaces;

public interface IJornadaCobroService
{
    Task ActualizarFechaJornadaAsync(int idJornada, ActualizarJornadaCobroRequest request);
}