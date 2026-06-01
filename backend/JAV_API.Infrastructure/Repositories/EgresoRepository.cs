using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JAV_API.Infrastructure.Repositories;

public class EgresoRepository : IEgresoRepository
{
    private readonly ApplicationDbContext _context;

    public EgresoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task RegistrarEgresoAsync(Egreso egreso)
    {
        // Añade el egreso a la tabla y guarda los cambios en Postgres
        _context.Egresos.Add(egreso);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Egreso>> ObtenerHistorialEgresosAsync()
    {
        // Retorna el historial ordenado por fecha de los más recientes a los más antiguos
        return await _context.Egresos
            .OrderByDescending(e => e.Fecha)
            .ToListAsync();
    }
}