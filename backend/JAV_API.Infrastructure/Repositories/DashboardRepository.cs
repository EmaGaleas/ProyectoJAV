using Microsoft.EntityFrameworkCore;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Infrastructure.Persistence;
using JAV_API.Domain.Enums; 

namespace JAV_API.Infrastructure.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly ApplicationDbContext _context;

    public DashboardRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponse> ObtenerResumenDashboardAsync(int mes, int anio)
    {
        var dashboard = new DashboardResponse();

        // 1. Métricas Financieras (Ingresos = Pagos Aprobados, Egresos = Egresos Aprobados)
        var ingresosTotales = await _context.Pagos
            .Where(p => p.FechaPago.Month == mes && p.FechaPago.Year == anio && p.Estado == EstadoAprobacion.Aprobado)
            .SumAsync(p => p.Monto);

        var egresosTotales = await _context.Egresos
            .Where(e => e.Fecha.Month == mes && e.Fecha.Year == anio /* && e.Estado == EstadoAprobacion.Aprobado */) // Descomentar si aplica estado a Egresos
            .SumAsync(e => e.Monto);

        // 2. Gestión de Usuarios
        // NOTA: Se asumen las conversiones de Enum a Int, se ajustarán según tus Enums reales
        var queryPadron = _context.Usuarios
            .Where(u => u.Rol == Rol.DuenoDeCasa); // <--- FILTRO DE ROL AQUÍ

        var totalUsuarios = await queryPadron.CountAsync();
        
        var usuariosInactivos = await queryPadron
            .Where(u => u.Estado == false)
            .CountAsync();

        // 1. Obtienes tu hora local
        var fechaActual = DateTime.UtcNow.Date; 

        var usuariosMorosos = await queryPadron
            .Where(u => u.Mensualidades.Any(m => 
                m.Estado == Estado.Vencido && 
                m.FechaVencimiento < fechaActual))
            .CountAsync();

        var usuariosActivos = totalUsuarios - usuariosInactivos - usuariosMorosos;

        dashboard.Usuarios = new MetricasUsuariosDto
        {
            Total = totalUsuarios,
            Activos = usuariosActivos < 0 ? 0 : usuariosActivos,
            Inactivos = usuariosInactivos,
            Morosos = usuariosMorosos
        };

        dashboard.MetricasFinancieras = new MetricasFinancierasDto
        {
            IngresosTotales = ingresosTotales,
            EgresosTotales = egresosTotales,
            TasaMorosidad = totalUsuarios > 0 ? ((decimal)usuariosMorosos / totalUsuarios) * 100 : 0
        };

        // 3. Desglose de Ingresos (Mensualidad, Multa, Conexión)
        
        // --- MENSUALIDADES ---
        var queryPagoMensualidades = _context.PagoMensualidades
            .Where(pm => pm.Pago.FechaPago.Month == mes 
                      && pm.Pago.FechaPago.Year == anio 
                      && pm.Pago.Estado == EstadoAprobacion.Aprobado);

        // OJO: Si tu tabla PagoMensualidad no tiene la propiedad 'Monto', 
        // debes navegar a la entidad relacionada, por ejemplo: pm.Mensualidad.Monto
        var montoMensualidades = await queryPagoMensualidades.SumAsync(pm => pm.Mensualidad.Monto); 
        var conteoMensualidades = await queryPagoMensualidades.CountAsync();

        // --- MULTAS ---
        var queryPagoMultas = _context.PagoMultas
            .Where(pm => pm.Pago.FechaPago.Month == mes 
                      && pm.Pago.FechaPago.Year == anio 
                      && pm.Pago.Estado == EstadoAprobacion.Aprobado);

        var montoMultas = await queryPagoMultas.SumAsync(pm => pm.Multa.Monto); 
        var conteoMultas = await queryPagoMultas.CountAsync();

        // --- CONEXIONES ---
        var queryPagoConexiones = _context.PagoConexiones
            .Where(pc => pc.Pago.FechaPago.Month == mes 
                      && pc.Pago.FechaPago.Year == anio 
                      && pc.Pago.Estado == EstadoAprobacion.Aprobado);

        var montoConexiones = await queryPagoConexiones.SumAsync(pc => pc.Conexion.Monto); 
        var conteoConexiones = await queryPagoConexiones.CountAsync();

        dashboard.DesgloceIngresos = new List<DesgloceIngresoDto>
        {
            new() { Tipo = "Mensualidad", Cantidad = conteoMensualidades, Monto = montoMensualidades, Color = "#308C58" },
            new() { Tipo = "Multa", Cantidad = conteoMultas, Monto = montoMultas, Color = "#E07A5F" },
            new() { Tipo = "Conexión", Cantidad = conteoConexiones, Monto = montoConexiones, Color = "#2B6CB0" }
        };

        // 4. Estado de Transacciones
        var estadosTransaccion = new List<EstadoAprobacion> { EstadoAprobacion.EnRevision, EstadoAprobacion.Aprobado /*, EstadoAprobacion.Rechazado */ };
        
        foreach (var estado in estadosTransaccion)
        {
            var ingresosEstado = await _context.Pagos
                .Where(p => p.FechaPago.Month == mes && p.FechaPago.Year == anio && p.Estado == estado)
                .CountAsync();

            var egresosEstado = await _context.Egresos
                .Where(e => e.Fecha.Month == mes && e.Fecha.Year == anio /* && e.Estado == estado */)
                .CountAsync();

            dashboard.EstadoTransacciones.Add(new EstadoTransaccionDataDto
            {
                Estado = estado.ToString(), // O mapear a "Pendiente", "Procesado" según dicte el front
                Ingresos = ingresosEstado,
                Egresos = egresosEstado,
                Color = estado == EstadoAprobacion.Aprobado ? "#E6F3EC" : "#FFF4E5" 
            });
        }

        // 5. Flujo de Caja Semanal (Lógica aproximada dividiendo el mes en 4 semanas)
        for (int i = 1; i <= 4; i++)
        {
            int diaInicio = (i - 1) * 7 + 1;
            int diaFin = i == 4 ? DateTime.DaysInMonth(anio, mes) : i * 7;

            var ingresosSemana = await _context.Pagos
                .Where(p => p.FechaPago.Month == mes && p.FechaPago.Year == anio && p.Estado == EstadoAprobacion.Aprobado 
                            && p.FechaPago.Day >= diaInicio && p.FechaPago.Day <= diaFin)
                .SumAsync(p => p.Monto);

            var egresosSemana = await _context.Egresos
                .Where(e => e.Fecha.Month == mes && e.Fecha.Year == anio 
                            && e.Fecha.Day >= diaInicio && e.Fecha.Day <= diaFin)
                .SumAsync(e => e.Monto);

            dashboard.DatosSemanales.Add(new DatosSemanaDto
            {
                Semana = $"Semana {i}",
                Ingresos = ingresosSemana,
                Egresos = egresosSemana
            });
        }

        return dashboard;
    }
}