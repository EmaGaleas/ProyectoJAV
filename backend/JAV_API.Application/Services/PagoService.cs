using System.IO;
using JAV_API.Application.Interfaces;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;

namespace JAV_API.Application.Services;

public class PagoService
{
    private readonly IPagoRepository _pagoRepository;
    private readonly IMensualidadRepository _mensualidadRepository;
    // NOTA: Deberás inyectar IMultaRepository e IConexionRepository cuando los crees
    private readonly IFileStorageService _fileStorageService;

    public PagoService(
        IPagoRepository pagoRepository, 
        IMensualidadRepository mensualidadRepository,
        IFileStorageService fileStorageService)
    {
        _pagoRepository = pagoRepository;
        _mensualidadRepository = mensualidadRepository;
        _fileStorageService = fileStorageService;
    }

    public async Task RegistrarPagoAsync(RegistrarPagoRequest request)
    {
        if (!request.MensualidadesIds.Any() && !request.MultasIds.Any() && !request.ConexionesIds.Any())
            throw new ArgumentException("Debe seleccionar al menos un ítem (mensualidad, multa o conexión) para pagar.");

        if (request.MetodoPago == MetodoPago.Transferencia && 
            (request.ComprobanteStream == Stream.Null || request.ComprobanteStream.Length == 0))
            throw new ArgumentException("Es obligatorio adjuntar la captura para pagos por transferencia.");

        // 1. Instanciar el Pago base
        var nuevoPago = new Pago
        {
            RegistradoPor = request.RegistradoPor,
            MetodoPago = request.MetodoPago,
            Monto = request.Monto,
            FechaPago = DateTime.UtcNow
        };

        // Listas para recolectar las entidades a procesar
        var pagoMensualidades = new List<PagoMensualidad>();
        var mensualidadesAPagar = new List<Mensualidad>();

        // 2. Procesar Mensualidades
        if (request.MensualidadesIds.Any())
        {
            // Requerirá que agregues ObtenerPorIdsAsync en IMensualidadRepository
            // mensualidadesAPagar = await _mensualidadRepository.ObtenerPorIdsAsync(request.MensualidadesIds);
            
            // Lógica temporal asumiendo que ya tienes las entidades:
            foreach (var mensualidad in mensualidadesAPagar)
            {
                if (mensualidad.Estado == Estado.Pagado)
                    throw new InvalidOperationException($"La mensualidad {mensualidad.IdMensualidad} ya está pagada.");

                mensualidad.Estado = Estado.Pagado;
                pagoMensualidades.Add(new PagoMensualidad { Mensualidad = mensualidad, Pago = nuevoPago });
            }
        }

        // TODO: Repetir el paso 2 para Multas y Conexiones cuando tengas sus repositorios...

        // 3. Procesar archivo si existe
        string urlComprobante = string.Empty;
        if (request.ComprobanteStream != Stream.Null && request.ComprobanteStream.Length > 0)
        {
            urlComprobante = await _fileStorageService.GuardarArchivoAsync(request.ComprobanteStream, request.ComprobanteNombre);
        }

        var nuevoComprobante = new Comprobante
        {
            Pago = nuevoPago,
            Codigo = request.CodigoComprobante,
            Url = urlComprobante
        };

        // 4. Enviar todo al repositorio
        await _pagoRepository.RegistrarPagoMasivoAsync(
            nuevoPago, 
            nuevoComprobante, 
            pagoMensualidades, 
            new List<PagoMulta>(), // Pasar las listas reales cuando implementes multas
            new List<PagoConexion>(), // Pasar las listas reales cuando implementes conexiones
            mensualidadesAPagar,
            new List<Multa>(),
            new List<Conexion>()
        );
    }
}