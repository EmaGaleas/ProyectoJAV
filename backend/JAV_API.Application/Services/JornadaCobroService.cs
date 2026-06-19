using JAV_API.Application.DTOs.Request;
using JAV_API.Application.DTOs.Response;
using JAV_API.Application.Interfaces;

namespace JAV_API.Application.Services;

public class JornadaCobroService : IJornadaCobroService
{
    private readonly IJornadaCobroRepository _jornadaRepo;
    private readonly IMensualidadRepository _mensualidadRepo;

    public JornadaCobroService(
        IJornadaCobroRepository jornadaRepo, 
        IMensualidadRepository mensualidadRepo)
    {
        _jornadaRepo = jornadaRepo;
        _mensualidadRepo = mensualidadRepo;
    }

    public async Task ActualizarFechaJornadaAsync(int idJornada, ActualizarJornadaCobroRequest request)
    {
        // Validación 1: No viajar al pasado
        //  AHORA (Definiendo primero la fecha real de tu zona)
        var horaDeMiZona = DateTime.UtcNow.AddHours(-6).Date;
        var fechaActual = DateTime.SpecifyKind(horaDeMiZona, DateTimeKind.Utc);

        if (request.NuevaFechaCobro.Date < fechaActual)
            throw new Exception("No se puede mover la jornada de cobro a una fecha en el pasado.");

        var jornada = await _jornadaRepo.ObtenerPorIdAsync(idJornada);
        if (jornada == null)
            throw new Exception("La jornada de cobro no existe.");

        // Validación 2: Inmutabilidad si ya se cerró la caja
        if (jornada.CierreCaja != null)
            throw new Exception("No se puede modificar una jornada de cobro que ya tiene un cierre de caja realizado.");

        if (!jornada.PeriodoCobro.HasValue)
            throw new Exception("La jornada no tiene un periodo de cobro asignado.");

        jornada.Fecha = DateTime.SpecifyKind(
            request.NuevaFechaCobro.Date,
            DateTimeKind.Utc
        );
        await _jornadaRepo.ActualizarAsync(jornada);

        var nuevaFechaVencimiento = DateTime.SpecifyKind(
            request.NuevaFechaCobro.Date.AddDays(1),
            DateTimeKind.Utc
        );

        await _mensualidadRepo.ActualizarVencimientoPorPeriodoAsync(
            jornada.PeriodoCobro.Value, 
            nuevaFechaVencimiento
        );

        await _jornadaRepo.GuardarCambiosAsync();
    }

    public async Task<IEnumerable<MesFechaResponse>> ObtenerFechasMesesAsync(int anio)
    {
        // Obtiene las jornadas filtradas por el año (tendrás que asegurar que tu Repo tenga este método)
        var jornadas = await _jornadaRepo.ObtenerPorAnioAsync(anio);

        // Nombres de los meses para mapeo rápido
        string[] nombresMeses = { "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                                  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" };

        return jornadas.Select(j => 
        {
            // Asumiendo que PeriodoCobro guarda la fecha o el mes, ajusta la lógica de extracción del mes según tu tipo de dato
            int mesIndex = j.PeriodoCobro.HasValue ? j.PeriodoCobro.Value.Month - 1 : 0; 

            return new MesFechaResponse
            {
                Id = j.IdJornadaCobro,
                Mes = nombresMeses[mesIndex],
                FechaInicio = j.Fecha?.ToString("yyyy-MM-dd") ?? "",
                FechaFin = "" // El frontend ya lo calcula con 'computeFechaFin'
            };
        }).OrderBy(m => m.Id); // Ajusta el orden según necesites
    }
}