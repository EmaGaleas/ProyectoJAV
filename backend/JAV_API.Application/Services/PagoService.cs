using JAV_API.Application.DTOs.Responses;
using JAV_API.Application.Interfaces;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Services;

public class PagoService
{
    private readonly IPagoRepository          _pagoRepository;
    private readonly IMensualidadRepository   _mensualidadRepository;
    private readonly IFileStorageService      _fileStorageService;

    public PagoService(
        IPagoRepository pagoRepository,
        IMensualidadRepository mensualidadRepository,
        IFileStorageService fileStorageService)
    {
        _pagoRepository        = pagoRepository;
        _mensualidadRepository = mensualidadRepository;
        _fileStorageService    = fileStorageService;
    }

    public async Task RegistrarPagoAsync(RegistrarPagoRequest request)
    {
        if (!request.MensualidadesIds.Any() && !request.MultasIds.Any() && !request.ConexionesIds.Any())
            throw new ArgumentException("Debe seleccionar al menos un ítem para pagar.");

        if (request.MetodoPago == MetodoPago.Transferencia &&
            (request.ComprobanteStream == Stream.Null || request.ComprobanteStream.Length == 0))
            throw new ArgumentException("Es obligatorio adjuntar el comprobante para pagos por transferencia.");

        var nuevoPago = new Pago
        {
            RegistradoPor = request.RegistradoPor,
            MetodoPago    = request.MetodoPago,
            Monto         = request.Monto,
            FechaPago     = DateTime.UtcNow
        };

        // Procesar mensualidades
        var pagoMensualidades   = new List<PagoMensualidad>();
        var mensualidadesAPagar = new List<Mensualidad>();

        if (request.MensualidadesIds.Any())
        {
            var mensualidades = (await _mensualidadRepository.ObtenerPorIdsAsync(request.MensualidadesIds)).ToList();

            foreach (var m in mensualidades)
            {
                if (m.Estado == Estado.Pagado)
                    throw new InvalidOperationException($"La mensualidad {m.IdMensualidad} ya está pagada.");

                m.Estado = Estado.Pagado;
                mensualidadesAPagar.Add(m);
                pagoMensualidades.Add(new PagoMensualidad { Mensualidad = m, Pago = nuevoPago });
            }
        }

        // Guardar comprobante si existe
        string urlComprobante = string.Empty;
        if (request.ComprobanteStream != Stream.Null && request.ComprobanteStream.Length > 0)
            urlComprobante = await _fileStorageService.GuardarArchivoAsync(request.ComprobanteStream, request.ComprobanteNombre);

        var nuevoComprobante = new Comprobante
        {
            Pago   = nuevoPago,
            Codigo = request.CodigoComprobante,
            Url    = urlComprobante
        };

        await _pagoRepository.RegistrarPagoMasivoAsync(
            nuevoPago,
            nuevoComprobante,
            pagoMensualidades,
            new List<PagoMulta>(),
            new List<PagoConexion>(),
            mensualidadesAPagar,
            new List<Multa>(),
            new List<Conexion>()
        );
    }

    public async Task<IEnumerable<PagoHistorialResponse>> ObtenerHistorialAsync()
    {
        var pagos = await _pagoRepository.ObtenerHistorialPagosAsync();
        return pagos.Select(MapToHistorial);
    }

    private static PagoHistorialResponse MapToHistorial(Pago p)
    {
        var primeraM    = p.PagoMensualidades.FirstOrDefault()?.Mensualidad;
        var primeraMulta = p.PagoMultas.FirstOrDefault()?.Multa;
        var titular     = primeraM?.Usuario ?? primeraMulta?.Usuario;

        var nombre     = titular != null
            ? $"{titular.Persona?.PrimerNombre} {titular.Persona?.PrimerApellido}".Trim()
            : "N/A";
        var dni        = titular?.Persona?.Dni ?? "N/A";
        var tipoIngreso = p.PagoMensualidades.Any() ? "Mensualidad" : "Multa";

        var lineas = new List<PagoLineaResponse>();

        foreach (var pm in p.PagoMensualidades)
        {
            var m    = pm.Mensualidad;
            var mora = m.Estado == Estado.Vencido ? m.Monto * 0.10m : 0m;
            lineas.Add(new PagoLineaResponse
            {
                Concepto   = m.PeriodoPago.HasValue ? m.PeriodoPago.Value.ToString("MMMM yyyy") : "Mensualidad",
                FechaVence = m.FechaVencimiento.HasValue ? m.FechaVencimiento.Value.ToString("yyyy-MM-dd") : string.Empty,
                Monto      = m.Monto,
                Mora       = mora,
                Tipo       = "mensualidad"
            });
        }

        foreach (var pm in p.PagoMultas)
        {
            var m = pm.Multa;
            lineas.Add(new PagoLineaResponse
            {
                Concepto   = m.TipoMulta?.Descripcion ?? "Multa",
                FechaVence = string.Empty,
                Monto      = m.Monto,
                Mora       = 0m,
                Tipo       = "multa"
            });
        }

        return new PagoHistorialResponse
        {
            Id                  = p.IdPago,
            Codigo              = p.Comprobante?.Codigo.ToString() ?? p.IdPago.ToString(),
            Titular             = nombre,
            Dni                 = dni,
            TipoIngreso         = tipoIngreso,
            Fecha               = p.FechaPago.ToString("yyyy-MM-dd"),
            Total               = p.Monto,
            Estado              = "Procesado",
            MetodoPago          = p.MetodoPago == MetodoPago.Efectivo ? "Efectivo" : "Transferencia",
            CodigoTransferencia = p.MetodoPago == MetodoPago.Transferencia ? p.Comprobante?.Codigo.ToString() : null,
            Lineas              = lineas
        };
    }
}
