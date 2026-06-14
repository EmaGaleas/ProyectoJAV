using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Interfaces;

public interface ITipoCobroRepository
{
    Task<IEnumerable<TipoCobro>> ObtenerPorTipoAsync(TipoCobroEnum tipo);
    Task<TipoCobro?> ObtenerPorIdAsync(int id);
    Task AgregarAsync(TipoCobro tipoCobro);
    Task ActualizarAsync(TipoCobro tipoCobro);
    Task EliminarAsync(TipoCobro tipoCobro);
    Task<bool> TieneHistorialAsociadoAsync(int idTipoCobro);
    Task GuardarCambiosAsync();
    Task<bool> ExisteDescripcionAsync(string descripcion, int? idAExcluir = null);
}