using JAV_API.Domain.Entities;

namespace JAV_API.Application.Interfaces;

public interface IMultaRepository
{
    /// <summary>Obtiene todas las multas con sus relaciones cargadas.</summary>
    Task<IEnumerable<Multa>> ObtenerTodosAsync();

    /// <summary>Obtiene una multa por su ID. Devuelve null si no existe.</summary>
    Task<Multa?> ObtenerPorIdAsync(int id);

    /// <summary>Persiste una nueva multa en la base de datos.</summary>
    Task CrearAsync(Multa multa);

    /// <summary>Cambia el estado de la multa a Anulado.</summary>
    Task AnularAsync(int id);

    /// <summary>Obtiene multas filtrando por los IDs indicados (usado por PagoService).</summary>
    Task<IEnumerable<Multa>> ObtenerPorIdsAsync(IEnumerable<int> ids);
}