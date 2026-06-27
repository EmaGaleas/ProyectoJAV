using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;

namespace JAV_API.Application.Interfaces;

/// <summary>
/// Contrato de la lógica de negocio para el módulo de Multas.
/// </summary>
public interface IMultaService
{
    /// <summary>Obtiene todas las multas registradas en el sistema.</summary>
    Task<IEnumerable<MultaResponse>> ObtenerTodosAsync();

    /// <summary>
    /// Registra una nueva multa. Valida que el TipoMulta sea de tipo Multa
    /// y que el usuario exista.
    /// </summary>
    Task<MultaResponse> RegistrarAsync(RegistrarMultaRequest request);

    /// <summary>
    /// Anula una multa existente. No se puede anular una multa ya anulada.
    /// </summary>
    Task AnularAsync(int id);
}
