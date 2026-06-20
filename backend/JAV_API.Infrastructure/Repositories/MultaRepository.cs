using Microsoft.EntityFrameworkCore;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

public class MultaRepository : IMultaRepository
{
    private readonly ApplicationDbContext _context;

    public MultaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<Multa>> ObtenerTodosAsync()
    {
        return await _context.Multas
            .Include(m => m.TipoMulta)
            .Include(m => m.Usuario)
                .ThenInclude(u => u.Persona)
            .OrderByDescending(m => m.IdMulta)
            .ToListAsync();
    }

    /// <inheritdoc/>
    public async Task<Multa?> ObtenerPorIdAsync(int id)
    {
        return await _context.Multas
            .Include(m => m.TipoMulta)
            .Include(m => m.Usuario)
                .ThenInclude(u => u.Persona)
            .FirstOrDefaultAsync(m => m.IdMulta == id);
    }

    /// <inheritdoc/>
    public async Task CrearAsync(Multa multa)
    {
        await _context.Multas.AddAsync(multa);
        await _context.SaveChangesAsync();
    }

    /// <inheritdoc/>
    public async Task AnularAsync(int id)
    {
        var multa = await _context.Multas.FindAsync(id)
            ?? throw new KeyNotFoundException($"No se encontró una multa con ID {id}.");

        multa.Estado = Estado.Anulado;
        await _context.SaveChangesAsync();
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<Multa>> ObtenerPorIdsAsync(IEnumerable<int> ids)
    {
        return await _context.Multas
            .Where(m => ids.Contains(m.IdMulta))
            .ToListAsync();
    }
}