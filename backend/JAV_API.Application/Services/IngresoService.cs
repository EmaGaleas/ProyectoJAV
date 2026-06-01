using System.IO;
using JAV_API.Application.Interfaces;
using JAV_API.Application.DTOs.Requests;
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
}