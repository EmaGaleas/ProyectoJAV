using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
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
        _context.Egresos.Add(egreso);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Egreso>> ObtenerHistorialEgresosAsync()
    {
        return await _context.Egresos
            .Include(e => e.Registrador).ThenInclude(u => u.Persona)
            .Include(e => e.Aprobador).ThenInclude(u => u!.Persona)
            .OrderByDescending(e => e.Fecha)
            .ToListAsync();
    }

    public async Task<Egreso?> ObtenerEgresoPorIdAsync(int id)
    {
        return await _context.Egresos
            .Include(e => e.Registrador).ThenInclude(u => u.Persona)
            .Include(e => e.Aprobador).ThenInclude(u => u!.Persona)
            .FirstOrDefaultAsync(e => e.IdEgreso == id);
    }

    public async Task AprobarEgresoAsync(int id, int aprobadoPor)
    {
        var egreso = await _context.Egresos.FindAsync(id)
            ?? throw new KeyNotFoundException($"Egreso {id} no encontrado.");

        egreso.Estado = EstadoAprobacion.Aprobado;
        egreso.AprobadoPor = aprobadoPor;
        await _context.SaveChangesAsync();
    }

    public async Task RechazarEgresoAsync(int id)
    {
        var egreso = await _context.Egresos.FindAsync(id)
            ?? throw new KeyNotFoundException($"Egreso {id} no encontrado.");

        egreso.Estado = EstadoAprobacion.Rechazado;
        await _context.SaveChangesAsync();
    }
}