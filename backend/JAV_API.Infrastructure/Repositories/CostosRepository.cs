using Microsoft.EntityFrameworkCore;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

public class CostosRepository : ICostosRepository
{
    private readonly ApplicationDbContext _context;

    public CostosRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HistorialCostos>> ObtenerVigentesAsync(TipoCobroEnum tipoCobroEnum, DateTime fechaActual)
    {
        return await _context.HistorialCostos
            .Include(h => h.TipoCobro)
            .Include(h => h.UsuarioEditor) // Navegación que agregamos para saber quién editó
            .ThenInclude(u => u.Persona)   // Para poder acceder al nombre de la persona
            .Where(h => h.TipoCobro.Tipo == tipoCobroEnum 
                     && h.FechaEmision <= fechaActual 
                     && h.FechaAnulacion == null)
            .OrderByDescending(h => h.FechaEmision)
            .ToListAsync();
    }

    public async Task<IEnumerable<HistorialCostos>> ObtenerProximosAsync(TipoCobroEnum tipoCobroEnum, DateTime fechaActual)
    {
        return await _context.HistorialCostos
            .Include(h => h.TipoCobro)
            .Include(h => h.UsuarioEditor)
            .ThenInclude(u => u.Persona)
            .Where(h => h.TipoCobro.Tipo == tipoCobroEnum 
                     && h.FechaEmision > fechaActual)
            .OrderBy(h => h.FechaEmision) // Ordenamos del más cercano al más lejano
            .ToListAsync();
    }

    public async Task<IEnumerable<HistorialCostos>> ObtenerHistorialAsync(TipoCobroEnum tipoCobroEnum)
    {
        return await _context.HistorialCostos
            .Include(h => h.TipoCobro)
            .Include(h => h.UsuarioEditor)
            .ThenInclude(u => u.Persona)
            .Where(h => h.TipoCobro.Tipo == tipoCobroEnum 
                     && h.FechaAnulacion != null) // Si tiene fecha de anulación, es historial
            .OrderByDescending(h => h.FechaAnulacion)
            .ToListAsync();
    }

    public async Task<HistorialCostos?> ObtenerPorIdAsync(int idCobro)
    {
        return await _context.HistorialCostos
            .Include(h => h.TipoCobro)
            .FirstOrDefaultAsync(h => h.IdCobro == idCobro);
    }

    public async Task<HistorialCostos?> ObtenerVigenteActualPorIdTipoCobroAsync(int idTipoCobro, DateTime fechaActual)
    {
        return await _context.HistorialCostos
            .FirstOrDefaultAsync(h => h.IdTipoCobro == idTipoCobro 
                                   && h.FechaEmision <= fechaActual 
                                   && h.FechaAnulacion == null);
    }

    public async Task<TipoCobro?> ObtenerTipoCobroPorIdAsync(int idTipoCobro)
    {
        return await _context.TiposCobro.FindAsync(idTipoCobro);
    }

    public async Task AgregarAsync(HistorialCostos historialCosto)
    {
        await _context.HistorialCostos.AddAsync(historialCosto);
    }

    public Task ActualizarAsync(HistorialCostos historialCosto)
    {
        _context.HistorialCostos.Update(historialCosto);
        return Task.CompletedTask; // Update en EF Core es síncrono, se impacta en SaveChangesAsync
    }

    public Task EliminarAsync(HistorialCostos historialCosto)
    {
        _context.HistorialCostos.Remove(historialCosto);
        return Task.CompletedTask;
    }

    public async Task GuardarCambiosAsync()
    {
        await _context.SaveChangesAsync();
    }
}