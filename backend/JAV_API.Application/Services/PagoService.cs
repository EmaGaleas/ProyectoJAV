using System.IO;
using JAV_API.Application.Interfaces;
using JAV_API.Application.DTOs.Requests;
using JAV_API.Application.DTOs.Responses;
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

    public async Task<IEnumerable<IngresoResponse>> ObtenerHistorialIngresosAsync(FiltrarIngresosRequest filtros)
    {
        var pagos = await _pagoRepository.ObtenerHistorialPagosAsync();
        IEnumerable<IngresoResponse> result = pagos.Select(MapToIngresoResponse);

        if (filtros.TipoPago.HasValue)
            result = result.Where(r => r.TipoIngreso == filtros.TipoPago.Value.ToString());
        if (!string.IsNullOrWhiteSpace(filtros.Estado))
            result = result.Where(r => r.Estado == filtros.Estado);
        if (filtros.Desde.HasValue)
            result = result.Where(r => r.Fecha >= filtros.Desde.Value);
        if (filtros.Hasta.HasValue)
            result = result.Where(r => r.Fecha <= filtros.Hasta.Value);

        return result;
    }

    /// <summary>
    /// Devuelve el historial de pagos del usuario autenticado (identificado por su IdUsuario),
    /// con filtro opcional por rango de fechas.
    /// Solo devuelve pagos donde ese usuario sea el titular (mensualidad/multa/conexión).
    /// </summary>
    public async Task<IEnumerable<HistorialPagoUsuarioResponse>> ObtenerHistorialPorUsuarioAsync(
        int idUsuario,
        DateTime? desde,
        DateTime? hasta)
    {
        var pagos = await _pagoRepository.ObtenerHistorialPorUsuarioAsync(idUsuario, desde, hasta);
        return pagos.Select(MapToHistorialUsuarioResponse);
    }

    public async Task<DetallePagoResponse> ObtenerDetallePagoModalAsync(int idPago)
    {
        var pago = await _pagoRepository.ObtenerPagoPorIdConDetallesAsync(idPago)
            ?? throw new KeyNotFoundException($"No se encontró el pago con ID {idPago}");

        Usuario? usuario = null;
        Domicilio? domicilio = null;
        string tipoPago = string.Empty;
        string estado = string.Empty;

        if (pago.PagoMensualidades?.Count > 0)
        {
            usuario = pago.PagoMensualidades.First().Mensualidad.Usuario;
            domicilio = usuario?.DomicilioUsuarios?.FirstOrDefault()?.Domicilio;
            tipoPago = "Mensualidad";
            estado = pago.PagoMensualidades.First().Mensualidad.Estado.ToString();
        }
        else if (pago.PagoMultas?.Count > 0)
        {
            usuario = pago.PagoMultas.First().Multa.Usuario;
            domicilio = usuario?.DomicilioUsuarios?.FirstOrDefault()?.Domicilio;
            tipoPago = "Multa";
            estado = pago.PagoMultas.First().Multa.Estado.ToString();
        }
        else if (pago.PagoConexiones?.Count > 0)
        {
            usuario = pago.PagoConexiones.First().Conexion.Usuario;
            domicilio = pago.PagoConexiones.First().Conexion.Domicilio;
            tipoPago = "Conexión";
            estado = pago.PagoConexiones.First().Conexion.Estado.ToString();
        }

        if (usuario?.Persona == null)
            throw new InvalidOperationException("El pago no está asociado a un titular válido.");

        var lineas = new List<LineaPagoResponse>();

        foreach (var pm in pago.PagoMensualidades ?? [])
        {
            lineas.Add(new LineaPagoResponse
            {
                Concepto         = pm.Mensualidad.PeriodoPago.HasValue
                                     ? $"Mensualidad {pm.Mensualidad.PeriodoPago.Value:MMMM yyyy}"
                                     : "Mensualidad",
                FechaVencimiento = pm.Mensualidad.FechaVencimiento,
                MontoBase        = pm.Mensualidad.Monto,
                Mora             = 0m,
                Tipo             = "mensualidad",
            });
        }

        foreach (var pm in pago.PagoMultas ?? [])
        {
            lineas.Add(new LineaPagoResponse
            {
                Concepto         = pm.Multa.TipoMulta?.Descripcion ?? "Multa",
                FechaVencimiento = null,
                MontoBase        = pm.Multa.Monto,
                Mora             = 0m,
                Tipo             = "multa",
            });
        }

        return new DetallePagoResponse
        {
            Titular            = $"{usuario.Persona.PrimerNombre} {usuario.Persona.PrimerApellido}",
            Dni                = usuario.Persona.Dni,
            NumeroComprobante  = pago.Comprobante?.Codigo.ToString() ?? $"PGO-{pago.IdPago}",
            Calle              = domicilio?.Calle.ToString() ?? "N/A",
            Bloque             = domicilio?.CodigoBloque.ToString() ?? "N/A",
            Lote               = domicilio?.LoteCasa ?? 0,
            MetodoPago         = pago.MetodoPago.ToString(),
            CodigoTransferencia = pago.MetodoPago == MetodoPago.Transferencia ? pago.Comprobante?.Codigo.ToString() : null,
            Fecha              = pago.FechaPago,
            TipoPago           = tipoPago,
            Estado             = estado,
            MontoTotal         = pago.Monto,
            Lineas             = lineas,
        };
    }

    private static IngresoResponse MapToIngresoResponse(Pago p)
    {
        Usuario? usuario = null;
        string tipoPago = string.Empty;
        string estado = string.Empty;

        if (p.PagoMensualidades?.Count > 0)
        {
            usuario = p.PagoMensualidades.First().Mensualidad?.Usuario;
            tipoPago = "Mensualidad";
            estado = p.PagoMensualidades.First().Mensualidad?.Estado.ToString() ?? "Pagado";
        }
        else if (p.PagoMultas?.Count > 0)
        {
            usuario = p.PagoMultas.First().Multa?.Usuario;
            tipoPago = "Multa";
            estado = p.PagoMultas.First().Multa?.Estado.ToString() ?? "Pagado";
        }
        else if (p.PagoConexiones?.Count > 0)
        {
            usuario = p.PagoConexiones.First().Conexion?.Usuario;
            tipoPago = "Conexión";
            estado = p.PagoConexiones.First().Conexion?.Estado.ToString() ?? "Pagado";
        }

        return new IngresoResponse
        {
            Id          = p.IdPago,
            Codigo      = p.Comprobante?.Codigo.ToString() ?? $"PGO-{p.IdPago}",
            TipoIngreso = tipoPago,
            Titular     = usuario?.Persona != null
                            ? $"{usuario.Persona.PrimerNombre} {usuario.Persona.PrimerApellido}"
                            : "N/A",
            Dni         = usuario?.Persona?.Dni ?? "N/A",
            Fecha       = p.FechaPago,
            Monto       = p.Monto,
            Estado      = estado,
        };
    }

    private static HistorialPagoUsuarioResponse MapToHistorialUsuarioResponse(Pago p)
    {
        string tipoPago = string.Empty;
        string estado   = string.Empty;

        if (p.PagoMensualidades?.Count > 0)
        {
            tipoPago = "Mensualidad";
            estado   = p.PagoMensualidades.First().Mensualidad?.Estado.ToString() ?? "Pagado";
        }
        else if (p.PagoMultas?.Count > 0)
        {
            tipoPago = "Multa";
            estado   = p.PagoMultas.First().Multa?.Estado.ToString() ?? "Pagado";
        }
        else if (p.PagoConexiones?.Count > 0)
        {
            tipoPago = "Conexión";
            estado   = p.PagoConexiones.First().Conexion?.Estado.ToString() ?? "Pagado";
        }

        var responsable = p.Registrador?.Persona != null
            ? $"{p.Registrador.Persona.PrimerNombre} {p.Registrador.Persona.PrimerApellido}"
            : "N/A";

        return new HistorialPagoUsuarioResponse
        {
            Id          = p.IdPago,
            Codigo      = p.Comprobante?.Codigo.ToString() ?? $"PGO-{p.IdPago}",
            Fecha       = p.FechaPago,
            Monto       = p.Monto,
            TipoPago    = tipoPago,
            MetodoPago  = p.MetodoPago.ToString(),
            Responsable = responsable,
            Estado      = estado,
        };
    }
}