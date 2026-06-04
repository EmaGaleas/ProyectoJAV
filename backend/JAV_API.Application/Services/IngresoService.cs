using JAV_API.Application.Interfaces;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Services;

public class IngresoService
{
    private readonly IPagoRepository _pagoRepository;
    private readonly IMensualidadRepository _mensualidadRepository;
    private readonly IFileStorageService _fileStorageService;

    public IngresoService(
        IPagoRepository pagoRepository,
        IMensualidadRepository mensualidadRepository,
        IFileStorageService fileStorageService)
    {
        _pagoRepository = pagoRepository;
        _mensualidadRepository = mensualidadRepository;
        _fileStorageService = fileStorageService;
    }

    public async Task RegistrarPagoMensualidadAsync(RegistrarIngresoRequest request)
    {
        var mensualidad = await _mensualidadRepository.ObtenerPorIdAsync(request.IdMensualidad);

        if (mensualidad == null)
            throw new Exception("La mensualidad indicada no existe.");

        if (mensualidad.Estado == Estado.Pagado)
            throw new Exception("Esta mensualidad ya se encuentra pagada.");

        // Validación si el pago es por transferencia y exige boucher físico
        if (request.MetodoPago == MetodoPago.Transferencia &&
            (request.ComprobanteStream == Stream.Null || request.ComprobanteStream.Length == 0))
        {
            throw new ArgumentException("Es obligatorio adjuntar la captura o boucher para pagos por transferencia.");
        }

        // Procesar archivo si existe
        string urlComprobante = string.Empty;
        if (request.ComprobanteStream != Stream.Null && request.ComprobanteStream.Length > 0)
        {
            urlComprobante = await _fileStorageService.GuardarArchivoAsync(request.ComprobanteStream, request.ComprobanteNombre);
        }

        // 1. Instanciar el Pago
        var nuevoPago = new Pago
        {
            RegistradoPor = request.RegistradoPor,
            MetodoPago = request.MetodoPago,
            Monto = request.Monto,
            FechaPago = DateTime.UtcNow
        };

        // 2. Instanciar la entidad intermedia N-N
        var pagoMensualidad = new PagoMensualidad
        {
            Mensualidad = mensualidad,
            Pago = nuevoPago
        };

        // 3. Instanciar el Comprobante con el código ingresado por el usuario
        var nuevoComprobante = new Comprobante
        {
            Pago = nuevoPago,
            Codigo = request.CodigoComprobante,
            Url = urlComprobante
        };

        // 4. Cambiar estado de la mensualidad
        mensualidad.Estado = Estado.Pagado;

        // 5. Enviar al repositorio bajo la protección de la transacción ACID
        await _pagoRepository.RegistrarPagoAsync(nuevoPago, pagoMensualidad, mensualidad, nuevoComprobante);
    }

    public async Task<IEnumerable<IngresoResponse>> ObtenerHistorialIngresosAsync(
        FiltrarIngresosRequest? filtros = null)
    {
        var pagos = await _pagoRepository.ObtenerHistorialIngresosAsync(filtros);
        return pagos.Select(MapearAIngresoResponse);
    }

    // ─────────────────────────────────────────────────────────
    // Métodos privados
    // ─────────────────────────────────────────────────────────

    /// <summary>
    /// Mapea la entidad Pago al DTO público de respuesta.
    /// Garantiza que nunca se exponga la entidad de dominio directamente.
    /// </summary>
    private static IngresoResponse MapearAIngresoResponse(Pago pago) =>
        new()
        {
            Codigo      = ObtenerCodigo(pago),
            TipoIngreso = ObtenerTipoIngreso(pago),
            Titular     = ObtenerTitular(pago),
            Dni         = ObtenerDni(pago),
            Fecha       = pago.FechaPago,
            Monto       = pago.Monto,
            Estado      = ObtenerEstado(pago)
        };

    private static string ObtenerEstado(Pago pago)
    {
        var estado = pago.PagoMensualidades.FirstOrDefault()?.Mensualidad.Estado
                  ?? pago.PagoMultas.FirstOrDefault()?.Multa.Estado
                  ?? pago.PagoConexiones.FirstOrDefault()?.Conexion.Estado;

        return estado?.ToString() ?? "Desconocido";
    }

    private static string ObtenerTipoIngreso(Pago pago)
    {
        if (pago.PagoMensualidades.Any()) return TipoCobroEnum.Mensualidad.ToString();
        if (pago.PagoMultas.Any())        return TipoCobroEnum.Multa.ToString();
        if (pago.PagoConexiones.Any())    return TipoCobroEnum.Pegue.ToString();
        return "Desconocido";
    }

    private static string ObtenerTitular(Pago pago)
    {
        var persona = pago.PagoMensualidades.FirstOrDefault()?.Mensualidad.Usuario.Persona
                   ?? pago.PagoMultas.FirstOrDefault()?.Multa.Usuario.Persona
                   ?? pago.PagoConexiones.FirstOrDefault()?.Conexion.Usuario.Persona;

        return persona is null
            ? "Desconocido"
            : $"{persona.PrimerNombre} {persona.PrimerApellido}";
    }

    private static string ObtenerDni(Pago pago)
    {
        var persona = pago.PagoMensualidades.FirstOrDefault()?.Mensualidad.Usuario.Persona
                   ?? pago.PagoMultas.FirstOrDefault()?.Multa.Usuario.Persona
                   ?? pago.PagoConexiones.FirstOrDefault()?.Conexion.Usuario.Persona;

        return persona?.Dni ?? "Desconocido";
    }

    private static string ObtenerCodigo(Pago pago) =>
        pago.Comprobante is not null
            ? $"C-{pago.Comprobante.Codigo:D2}"
            : $"P-{pago.IdPago:D2}";
}