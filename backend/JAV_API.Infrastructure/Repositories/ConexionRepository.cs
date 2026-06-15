using Microsoft.EntityFrameworkCore;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

public class ConexionRepository : IConexionRepository
{
    private readonly ApplicationDbContext _context;

    public ConexionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Conexion>> ObtenerPorIdsAsync(IEnumerable<int> ids)
    {
        return await _context.Conexiones
            .Where(c => ids.Contains(c.IdConexion))
            .ToListAsync();
    }
}