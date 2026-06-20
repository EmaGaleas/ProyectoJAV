using JAV_API.Application.DTOs.Request;
using JAV_API.Application.DTOs.Response;
using JAV_API.Application.Interfaces;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Services;

public class CostosService : ICostosService
{
    private readonly ICostosRepository _costosRepository;

    public CostosService(ICostosRepository costosRepository)
    {
        _costosRepository = costosRepository;
    }

    public async Task<IEnumerable<CostoVigenteResponse>> ObtenerCostosVigentesAsync(TipoCobroEnum tipoCobro)
    {
        var horaDeMiZona = DateTime.UtcNow.AddHours(-6).Date;
        var fechaActual = DateTime.SpecifyKind(horaDeMiZona, DateTimeKind.Utc);
        var vigentes = await _costosRepository.ObtenerVigentesAsync(tipoCobro, fechaActual);

        return vigentes.Select(v => new CostoVigenteResponse
        {
            Id = v.IdCobro,
            Tipo = v.TipoCobro.Tipo.ToString(),
            Descripcion = v.TipoCobro.Descripcion,
            Monto = v.Monto,
            FechaInicio = v.FechaEmision?.ToString("yyyy-MM-dd") ?? ""
        });
    }

    public async Task<IEnumerable<CostoVigenteResponse>> ObtenerProximasVigenciasAsync(TipoCobroEnum tipoCobro)
    {
        var horaDeMiZona = DateTime.UtcNow.AddHours(-6).Date;
        var fechaActual = DateTime.SpecifyKind(horaDeMiZona, DateTimeKind.Utc);
        var proximos = await _costosRepository.ObtenerProximosAsync(tipoCobro, fechaActual);

        return proximos.Select(p => new CostoVigenteResponse
        {
            Id = p.IdCobro,
            Tipo = p.TipoCobro.Tipo.ToString(),
            Descripcion = p.TipoCobro.Descripcion,
            Monto = p.Monto,
            FechaInicio = p.FechaEmision?.ToString("yyyy-MM-dd") ?? ""
        });
    }

    public async Task<IEnumerable<CostoHistorialResponse>> ObtenerHistorialAsync(TipoCobroEnum tipoCobro)
    {
        var historial = await _costosRepository.ObtenerHistorialAsync(tipoCobro);

        var historialSinMora = historial.Where(h => !h.TipoCobro.Descripcion.ToLower().Contains("mora"));

        return historialSinMora.Select(h => new CostoHistorialResponse
        {
            Id = h.IdCobro,
            Tipo = h.TipoCobro.Tipo.ToString(),
            Descripcion = h.TipoCobro.Descripcion,      
            Monto = h.Monto,
            FechaInicio = h.FechaEmision?.ToString("yyyy-MM-dd") ?? "",
            FechaFin = h.FechaAnulacion?.ToString("yyyy-MM-dd") ?? "",
            EditadoPor = $"{h.UsuarioEditor?.Persona?.PrimerNombre} {h.UsuarioEditor?.Persona?.PrimerApellido}".Trim(),
            EditadoEl = h.FechaEmision?.ToString("yyyy-MM-dd") ?? "" 
        });
    }

    public async Task<CostoVigenteResponse> RegistrarCostoAsync(RegistrarCostoRequest request, int idUsuarioEditor)
    {
        // Validación 1: Montos lógicos
        if (request.Monto <= 0)
            throw new Exception("El monto del cobro debe ser mayor a cero.");

        var tipoExistente = await _costosRepository.ObtenerTipoCobroPorIdAsync(request.IdTipoCobro);
        if (tipoExistente == null)
            throw new Exception("El tipo de cobro no existe.");

        // 🛡️ SOLUCIÓN: Calculamos hoy en UTC-6 con pasaporte UTC
        var horaDeMiZona = DateTime.UtcNow.AddHours(-6).Date;
        var fechaActual = DateTime.SpecifyKind(horaDeMiZona, DateTimeKind.Utc);

        // 🛡️ SOLUCIÓN: Deserializamos la fecha del JSON asignándole explícitamente el pasaporte UTC
        var fechaInicioBlindada = DateTime.SpecifyKind(request.FechaInicio.Date, DateTimeKind.Utc);

        // Validación 2: Evitar colisión de precios futuros
        var proximos = await _costosRepository.ObtenerProximosAsync(tipoExistente.Tipo, fechaActual);
        if (proximos.Any(p => p.IdTipoCobro == request.IdTipoCobro))
            throw new Exception("Ya existe un precio programado para el futuro. Bórrelo o modifíquelo antes de registrar uno nuevo.");
        
        var costoVigente = await _costosRepository.ObtenerVigenteActualPorIdTipoCobroAsync(request.IdTipoCobro, fechaActual);

        // Si la nueva fecha de inicio es igual o menor a hoy, entra en vigencia de inmediato
        if (fechaInicioBlindada <= fechaActual)
        {
            if (costoVigente != null)
            {
                // Validación 3: Evitar viajar al pasado antes del precio actual
                if (fechaInicioBlindada <= costoVigente.FechaEmision?.Date)
                    throw new Exception("La fecha de inicio no puede ser igual o menor a la fecha de emisión del costo actual vigente.");

                // Regla de negocio: cerramos el registro anterior 1 día antes con formato UTC seguro
                var fechaAnulacionCalculada = fechaInicioBlindada.AddDays(-1);
                costoVigente.FechaAnulacion = DateTime.SpecifyKind(fechaAnulacionCalculada, DateTimeKind.Utc);
                
                await _costosRepository.ActualizarAsync(costoVigente);
            }
        }

        var nuevoCosto = new HistorialCostos
        {
            IdTipoCobro = request.IdTipoCobro,
            Monto = request.Monto,
            FechaEmision = fechaInicioBlindada, // Usamos la fecha limpia de JSON con sello UTC
            FechaAnulacion = null, 
            EditadoPor = idUsuarioEditor
        };

        await _costosRepository.AgregarAsync(nuevoCosto);
        await _costosRepository.GuardarCambiosAsync();

        return new CostoVigenteResponse
        {
            Id = nuevoCosto.IdCobro,
            Tipo = tipoExistente.Tipo.ToString(),
            Descripcion = tipoExistente.Descripcion,
            Monto = nuevoCosto.Monto,
            FechaInicio = nuevoCosto.FechaEmision?.ToString("yyyy-MM-dd") ?? ""
        };
    }

    public async Task EliminarProximaVigenciaAsync(int idCobro)
    {
        var costo = await _costosRepository.ObtenerPorIdAsync(idCobro);
        if (costo == null)
            throw new Exception("El costo no fue encontrado.");

        // 🛡️ SOLUCIÓN: Controlamos la fecha actual en la zona horaria correcta
        var horaDeMiZona = DateTime.UtcNow.AddHours(-6).Date;
        var fechaActual = DateTime.SpecifyKind(horaDeMiZona, DateTimeKind.Utc);

        if (costo.FechaEmision <= fechaActual)
            throw new Exception("No se puede eliminar una vigencia que ya está activa o en el pasado.");

        await _costosRepository.EliminarAsync(costo);
        await _costosRepository.GuardarCambiosAsync();
    }

    public async Task<CostoVigenteResponse?> ObtenerMoraActualAsync()
    {
        // 🛡️ SOLUCIÓN: Corregido el parámetro para la consulta
        var horaDeMiZona = DateTime.UtcNow.AddHours(-6).Date;
        var fechaActual = DateTime.SpecifyKind(horaDeMiZona, DateTimeKind.Utc);
        
        var vigentes = await _costosRepository.ObtenerVigentesAsync(TipoCobroEnum.Multa, fechaActual);

        // Filtramos la multa que contenga "mora" en su descripción
        var moraVigente = vigentes.FirstOrDefault(v => v.TipoCobro.Descripcion.ToLower().Contains("mora"));

        if (moraVigente == null) return null;

        return new CostoVigenteResponse
        {
            Id = moraVigente.IdCobro,
            Tipo = moraVigente.TipoCobro.Tipo.ToString(),
            Descripcion = moraVigente.TipoCobro.Descripcion,
            Monto = moraVigente.Monto,
            FechaInicio = moraVigente.FechaEmision?.ToString("yyyy-MM-dd") ?? ""
        };
    }

    public async Task<IEnumerable<CostoVigenteResponse>> ObtenerMoraProximasVigenciasAsync()
    {
        var horaDeMiZona = DateTime.UtcNow.AddHours(-6).Date;
        var fechaActual = DateTime.SpecifyKind(horaDeMiZona, DateTimeKind.Utc);
        
        var proximas = await _costosRepository.ObtenerProximosAsync(TipoCobroEnum.Multa, fechaActual);
        
        // Filtramos solo las que son de mora
        var moraProximas = proximas.Where(p => p.TipoCobro.Descripcion.ToLower().Contains("mora"));

        return moraProximas.Select(p => new CostoVigenteResponse
        {
            Id = p.IdCobro,
            Tipo = p.TipoCobro.Tipo.ToString(),
            Descripcion = p.TipoCobro.Descripcion,
            Monto = p.Monto,
            FechaInicio = p.FechaEmision?.ToString("yyyy-MM-dd") ?? ""
        });
    }

    public async Task<IEnumerable<CostoHistorialResponse>> ObtenerMoraHistorialAsync()
    {
        var historial = await _costosRepository.ObtenerHistorialAsync(TipoCobroEnum.Multa);
        
        var moraHistorial = historial.Where(h => h.TipoCobro.Descripcion.ToLower().Contains("mora"));

        return moraHistorial.Select(h => new CostoHistorialResponse
        {
            Id = h.IdCobro,
            Tipo = h.TipoCobro.Tipo.ToString(),
            Descripcion = h.TipoCobro.Descripcion,
            Monto = h.Monto,
            FechaInicio = h.FechaEmision?.ToString("yyyy-MM-dd") ?? "",
            FechaFin = h.FechaAnulacion?.ToString("yyyy-MM-dd") ?? "",
            EditadoPor = $"{h.UsuarioEditor?.Persona?.PrimerNombre} {h.UsuarioEditor?.Persona?.PrimerApellido}".Trim(),
            EditadoEl = h.FechaEmision?.ToString("yyyy-MM-dd") ?? "" 
        });
    }
}