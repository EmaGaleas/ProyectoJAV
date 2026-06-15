using Microsoft.EntityFrameworkCore;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

public class TipoCobroRepository : ITipoCobroRepository
{
    private readonly ApplicationDbContext _context;

    public TipoCobroRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TipoCobro>> ObtenerPorTipoAsync(TipoCobroEnum tipo)
    {
        return await _context.Set<TipoCobro>()
            .Where(t => t.Tipo == tipo)
            .ToListAsync();
    }

    public async Task<TipoCobro?> ObtenerPorIdAsync(int id)
    {
        return await _context.Set<TipoCobro>().FindAsync(id);
    }

    public async Task AgregarAsync(TipoCobro tipoCobro)
    {
        await _context.Set<TipoCobro>().AddAsync(tipoCobro);
    }

    public async Task ActualizarAsync(TipoCobro tipoCobro)
    {
        _context.Set<TipoCobro>().Update(tipoCobro);
        await Task.CompletedTask;
    }

    public async Task EliminarAsync(TipoCobro tipoCobro)
    {
        _context.Set<TipoCobro>().Remove(tipoCobro);
        await Task.CompletedTask;
    }

    public async Task<bool> TieneHistorialAsociadoAsync(int idTipoCobro)
    {
        // Regla: No podemos borrar un tipo de multa si ya se le asignaron precios en el pasado
        return await _context.Set<HistorialCostos>().AnyAsync(h => h.IdTipoCobro == idTipoCobro);
    }

    public async Task GuardarCambiosAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExisteDescripcionAsync(string descripcion, int? idAExcluir = null)
    {
        var query = _context.Set<TipoCobro>()
            .Where(t => t.Descripcion.ToLower() == descripcion.ToLower());
            
        if (idAExcluir.HasValue)
            query = query.Where(t => t.IdTipoCobro != idAExcluir.Value);
            
        return await query.AnyAsync();
    }
}