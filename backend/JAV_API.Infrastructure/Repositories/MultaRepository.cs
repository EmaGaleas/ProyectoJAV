using Microsoft.EntityFrameworkCore;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

public class MultaRepository : IMultaRepository
{
    private readonly ApplicationDbContext _context;

    public MultaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Multa>> ObtenerPorIdsAsync(IEnumerable<int> ids)
    {
        // Traemos las multas cuyos IDs coincidan con los que manda el frontend
        return await _context.Multas
            .Where(m => ids.Contains(m.IdMulta))
            .ToListAsync();
    }
}