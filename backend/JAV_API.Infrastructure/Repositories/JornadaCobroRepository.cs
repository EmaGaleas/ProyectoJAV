using Microsoft.EntityFrameworkCore;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

public class JornadaCobroRepository : IJornadaCobroRepository
{
    private readonly ApplicationDbContext _context;

    public JornadaCobroRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<JornadaCobro?> ObtenerPorIdAsync(int id)
    {
        return await _context.Set<JornadaCobro>().FindAsync(id);
    }

    public async Task ActualizarAsync(JornadaCobro jornada)
    {
        _context.Set<JornadaCobro>().Update(jornada);
        await Task.CompletedTask;
    }

    public async Task GuardarCambiosAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<JornadaCobro>> ObtenerPorAnioAsync(int anio)
    {
        return await _context.Set<JornadaCobro>()
            // Filtramos asumiendo que PeriodoCobro (que guarda el mes al que corresponde) no es nulo y coincide con el año
            .Where(j => j.PeriodoCobro.HasValue && j.PeriodoCobro.Value.Year == anio)
            .ToListAsync();
    }
}