using JAV_API.Application.DTOs.Request;
using JAV_API.Application.DTOs.Response;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Services;

public class TipoCobroService : ITipoCobroService
{
    private readonly ITipoCobroRepository _repository;

    public TipoCobroService(ITipoCobroRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TipoCobroResponse>> ObtenerTiposMultaAsync()
    {
        var multas = await _repository.ObtenerPorTipoAsync(TipoCobroEnum.Multa);
        return multas.Select(m => new TipoCobroResponse
        {
            IdTipoCobro = m.IdTipoCobro,
            Tipo = m.Tipo.ToString(),
            Descripcion = m.Descripcion
        });
    }

    public async Task<TipoCobroResponse> CrearTipoMultaAsync(CrearTipoMultaRequest request)
    {
        if (await _repository.ExisteDescripcionAsync(request.Descripcion))
            throw new Exception("Ya existe una multa con esta misma descripción.");

        var nuevoTipo = new TipoCobro
        {
            Tipo = TipoCobroEnum.Multa,
            Descripcion = request.Descripcion
        };

        await _repository.AgregarAsync(nuevoTipo);
        await _repository.GuardarCambiosAsync();

        return new TipoCobroResponse
        {
            IdTipoCobro = nuevoTipo.IdTipoCobro,
            Tipo = nuevoTipo.Tipo.ToString(),
            Descripcion = nuevoTipo.Descripcion
        };
    }

    public async Task<TipoCobroResponse> ActualizarTipoMultaAsync(int id, ActualizarTipoMultaRequest request)
    {
        if (await _repository.ExisteDescripcionAsync(request.Descripcion, id))
            throw new Exception("Ya existe otra multa con esta misma descripción.");
        var tipoExistente = await _repository.ObtenerPorIdAsync(id);
        if (tipoExistente == null || tipoExistente.Tipo != TipoCobroEnum.Multa)
            throw new Exception("El tipo de multa no existe.");

        tipoExistente.Descripcion = request.Descripcion;
        
        await _repository.ActualizarAsync(tipoExistente);
        await _repository.GuardarCambiosAsync();

        return new TipoCobroResponse
        {
            IdTipoCobro = tipoExistente.IdTipoCobro,
            Tipo = tipoExistente.Tipo.ToString(),
            Descripcion = tipoExistente.Descripcion
        };
    }

    public async Task EliminarTipoMultaAsync(int id)
    {
        var tipoExistente = await _repository.ObtenerPorIdAsync(id);
        if (tipoExistente == null || tipoExistente.Tipo != TipoCobroEnum.Multa)
            throw new Exception("El tipo de multa no existe.");

        var tieneHistorial = await _repository.TieneHistorialAsociadoAsync(id);
        if (tieneHistorial)
            throw new Exception("No se puede eliminar esta multa porque tiene un historial de precios asignado. Considere cambiar su estado a inactivo (si aplica) o dejar de usarla.");

        await _repository.EliminarAsync(tipoExistente);
        await _repository.GuardarCambiosAsync();
    }
}