using Microsoft.EntityFrameworkCore;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Enums;
using JAV_API.Infrastructure.Persistence;

namespace JAV_API.Infrastructure.Repositories;

public class ReporteRepository : IReporteRepository
{
    private readonly ApplicationDbContext _context;

    public ReporteRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MorosoResponse>> ObtenerMorososAsync()
    {
        // Extraemos usuarios que tengan mensualidades, multas o conexiones vencidas
        var morosos = await _context.Usuarios
            .Include(u => u.Persona)
            .Include(u => u.DomicilioUsuarios)
                .ThenInclude(du => du.Domicilio)
            .Include(u => u.Mensualidades)
            .Where(u => u.Mensualidades.Any(m => m.Estado == Estado.Vencido))
            .ToListAsync();

        return morosos.Select(u => 
        {
            var deudasMensualidad = u.Mensualidades.Where(m => m.Estado == Estado.Vencido).ToList();

            var mesesAtraso = deudasMensualidad.Count;
            var montoTotal = deudasMensualidad.Sum(m => m.Monto);

            // Construir el detalle descriptivo de la deuda
            var detalles = new List<string>();
            if (deudasMensualidad.Count > 0) detalles.Add($"{deudasMensualidad.Count} Mensualidad(es)");

            var domicilioActivo = u.DomicilioUsuarios.FirstOrDefault(du => du.Estado)?.Domicilio;

            return new MorosoResponse(
                Id: u.IdUsuario.ToString(),
                Residente: $"{u.Persona.PrimerNombre} {u.Persona.PrimerApellido}",
                Dni: u.Persona.Dni,
                Ubicacion: new UbicacionResponse(
                    Bloque: domicilioActivo?.CodigoBloque.ToString() ?? "N/A",
                    Lote: domicilioActivo?.LoteCasa.ToString() ?? "N/A",
                    Calle: domicilioActivo?.Calle.ToString() ?? "N/A"
                ),
                MesesAtraso: mesesAtraso,
                DetalleDeuda: string.Join(", ", detalles),
                MontoTotal: montoTotal
            );
        });
    }

    public async Task<IEnumerable<BalanceResponse>> ObtenerBalanceGeneralAsync()
    {
        var balance = new List<BalanceResponse>();

        // 1. Ingresos por Mensualidades (relacionadas a un Pago Aprobado)
        var ingresosMensualidad = await _context.Mensualidades
            .Include(m => m.PagoMensualidades).ThenInclude(pm => pm.Pago)
            .Include(m => m.Usuario).ThenInclude(u => u.DomicilioUsuarios).ThenInclude(du => du.Domicilio)
            .Where(m => m.Estado == Estado.Pagado && m.PagoMensualidades.Any(pm => pm.Pago.Estado == EstadoAprobacion.Aprobado))
            .Select(m => new
            {
                m.IdMensualidad,
                m.Monto,
                Pago = m.PagoMensualidades
                        .Where(pm => pm.Pago.Estado == EstadoAprobacion.Aprobado)
                        .Select(pm => pm.Pago)
                        .FirstOrDefault(),
                Domicilio = m.Usuario.DomicilioUsuarios
                    .Select(du => du.Domicilio)
                    .FirstOrDefault()
            })
            .ToListAsync();

        balance.AddRange(ingresosMensualidad.Select(m => new BalanceResponse(
            Id: $"MEN-{m.IdMensualidad}",
            Codigo: $"ING-MEN-{m.Pago.IdPago}",
            Fecha: m.Pago.FechaPago.ToString("yyyy-MM-dd"),
            Tipo: "Ingreso",
            Categoria: "Mensualidad",
            Descripcion: $"Pago Mensualidad - Bloque {m.Domicilio?.CodigoBloque} Lote {m.Domicilio?.LoteCasa}",
            Monto: m.Monto
        )));

        // 2. Ingresos por Multas (relacionadas a un Pago Aprobado)
        var ingresosMulta = await _context.Multas
            .Include(m => m.PagoMultas).ThenInclude(pm => pm.Pago)
            .Include(m => m.Usuario).ThenInclude(u => u.DomicilioUsuarios).ThenInclude(du => du.Domicilio)
            .Where(m => m.Estado == Estado.Pagado && m.PagoMultas.Any(pm => pm.Pago.Estado == EstadoAprobacion.Aprobado))
            .Select(m => new
            {
                m.IdMulta,
                m.Monto,
                Pago = m.PagoMultas
                        .Where(pm => pm.Pago.Estado == EstadoAprobacion.Aprobado)
                        .Select(pm => pm.Pago)
                        .FirstOrDefault(),
                Domicilio = m.Usuario.DomicilioUsuarios
                    .Select(du => du.Domicilio)
                    .FirstOrDefault()
            })
            .ToListAsync();

        balance.AddRange(ingresosMulta.Select(m => new BalanceResponse(
            Id: $"MUL-{m.IdMulta}",
            Codigo: $"ING-MUL-{m.Pago.IdPago}",
            Fecha: m.Pago.FechaPago.ToString("yyyy-MM-dd"),
            Tipo: "Ingreso",
            Categoria: "Multa",
            Descripcion: $"Pago Multa - Bloque {m.Domicilio?.CodigoBloque} Lote {m.Domicilio?.LoteCasa}",
            Monto: m.Monto
        )));

        // 3. Ingresos por Conexiones (relacionadas a un Pago Aprobado)
        var ingresosConexion = await _context.Conexiones
            .Include(c => c.PagoConexiones).ThenInclude(pc => pc.Pago)
            .Include(c => c.Usuario).ThenInclude(u => u.DomicilioUsuarios).ThenInclude(du => du.Domicilio)
            .Where(c => c.Estado == Estado.Pagado && c.PagoConexiones.Any(pc => pc.Pago.Estado == EstadoAprobacion.Aprobado))
            .Select(c => new
            {
                c.IdConexion,
                c.Monto,
                Pago = c.PagoConexiones
                    .Where(pm => pm.Pago.Estado == EstadoAprobacion.Aprobado)
                    .Select(pm => pm.Pago)
                    .FirstOrDefault(),
                Domicilio = c.Usuario.DomicilioUsuarios
                    .Select(du => du.Domicilio)
                    .FirstOrDefault()
            })
            .ToListAsync();

        balance.AddRange(ingresosConexion.Select(c => new BalanceResponse(
            Id: $"CON-{c.IdConexion}",
            Codigo: $"ING-CON-{c.Pago.IdPago}",
            Fecha: c.Pago.FechaPago.ToString("yyyy-MM-dd"),
            Tipo: "Ingreso",
            Categoria: "Conexión",
            Descripcion: $"Pago Conexión - Bloque {c.Domicilio?.CodigoBloque} Lote {c.Domicilio?.LoteCasa}",
            Monto: c.Monto
        )));

        // 4. Egresos Aprobados
        var egresosAprobados = await _context.Egresos
            .Where(e => e.Estado == EstadoAprobacion.Aprobado)
            .ToListAsync();

        balance.AddRange(egresosAprobados.Select(e => new BalanceResponse(
            Id: $"EGR-{e.IdEgreso}",
            Codigo: $"EGR-00{e.IdEgreso}",
            Fecha: e.Fecha.ToString("yyyy-MM-dd"),
            Tipo: "Egreso",
            Categoria: e.Titulo,
            Descripcion: e.Descripcion,
            Monto: e.Monto
        )));

        // Retornar ordenado por fecha descendente
        return balance.OrderByDescending(b => b.Fecha);
    }
}