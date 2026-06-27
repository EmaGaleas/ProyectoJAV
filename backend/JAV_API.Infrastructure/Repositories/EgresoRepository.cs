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
        // Añade el egreso a la tabla y guarda los cambios en Postgres
        _context.Egresos.Add(egreso);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Egreso>> ObtenerHistorialEgresosAsync()
    {
        // Retorna el historial ordenado por fecha de los más recientes a los más antiguos
        return await _context.Egresos
            .Include(e => e.Registrador)
                .ThenInclude(u => u.Persona)
            .Include(e => e.Aprobador)
                .ThenInclude(u => u!.Persona)
            .OrderByDescending(e => e.Fecha)
            .ToListAsync();
    }

    public async Task<Egreso?> ObtenerPorIdAsync(int idEgreso)
    {
        return await _context.Egresos.FindAsync(idEgreso);
    }

    public async Task AprobarAsync(int idEgreso, int aprobadoPor)
    {
        var egreso = await _context.Egresos.FindAsync(idEgreso)
            ?? throw new KeyNotFoundException($"No se encontró el egreso con ID {idEgreso}.");

        if (egreso.Estado != EstadoAprobacion.EnRevision)
            throw new InvalidOperationException($"El egreso ya fue procesado con estado '{egreso.Estado}'.");

        egreso.Estado = EstadoAprobacion.Aprobado;
        egreso.AprobadoPor = aprobadoPor;
        await _context.SaveChangesAsync();
    }

    public async Task RechazarAsync(int idEgreso, string? comentario)
    {
        var egreso = await _context.Egresos.FindAsync(idEgreso)
            ?? throw new KeyNotFoundException($"No se encontró el egreso con ID {idEgreso}.");

        if (egreso.Estado != EstadoAprobacion.EnRevision)
            throw new InvalidOperationException($"El egreso ya fue procesado con estado '{egreso.Estado}'.");

        egreso.Estado = EstadoAprobacion.Rechazado;
        egreso.ComentarioRechazo = comentario; // Se guarda el motivo
        await _context.SaveChangesAsync();
    }
}