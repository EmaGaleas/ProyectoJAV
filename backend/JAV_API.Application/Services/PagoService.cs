using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    private readonly IMultaRepository _multaRepository;
    private readonly IConexionRepository _conexionRepository;
    private readonly IFileStorageService _fileStorageService; // Añadido
    private readonly ICostosService _costosService;           // Añadido

    public PagoService(
        IPagoRepository pagoRepository, 
        IMensualidadRepository mensualidadRepository,
        IMultaRepository multaRepository,
        IConexionRepository conexionRepository,
        IFileStorageService fileStorageService,
        ICostosService costosService)
    {
        _pagoRepository = pagoRepository;
        _mensualidadRepository = mensualidadRepository;
        _multaRepository = multaRepository;
        _conexionRepository = conexionRepository;
        _fileStorageService = fileStorageService;
        _costosService = costosService;
    }

    public async Task RegistrarPagoAsync(RegistrarPagoRequest request)
    {
        if (!request.MensualidadesIds.Any() && !request.MultasIds.Any() && !request.ConexionesIds.Any())
            throw new ArgumentException("Debe seleccionar al menos un ítem para pagar.");

        var nuevoPago = new Pago
        {
            RegistradoPor = request.RegistradoPor,
            MetodoPago = request.MetodoPago,
            Monto = request.Monto,
            FechaPago = DateTime.UtcNow,
            Estado = EstadoAprobacion.EnRevision
        };

        var pagoMensualidades = new List<PagoMensualidad>();
        var mensualidadesAPagar = new List<Mensualidad>();
        
        var pagoMultas = new List<PagoMulta>();
        var multasExistentesAPagar = new List<Multa>();
        var multasNuevasGeneradas = new List<Multa>(); // Lista para las moras creadas al vuelo

        var pagoConexiones = new List<PagoConexion>();
        var conexionesAPagar = new List<Conexion>();

        // Obtenemos el valor actual de la mora
        var moraVigente = await _costosService.ObtenerMoraActualAsync();

        // 1. Procesar Mensualidades y generar Moras dinámicas
        if (request.MensualidadesIds.Any())
        {
            mensualidadesAPagar = (await _mensualidadRepository.ObtenerPorIdsAsync(request.MensualidadesIds)).ToList();
            foreach (var mensualidad in mensualidadesAPagar)
            {
                if (mensualidad.Estado == Estado.Pagado)
                    throw new InvalidOperationException($"La mensualidad {mensualidad.IdMensualidad} ya está pagada.");

                // Si está vencida, generamos el castigo de mora
                if (mensualidad.Estado == Estado.Vencido && moraVigente != null)
                {
                    var nuevaMora = new Multa
                    {
                        IdUsuario = mensualidad.IdUsuario,
                        IdTipoMulta = moraVigente.IdTipoCobro,
                        Monto = moraVigente.Monto,
                        Estado = Estado.Pagado // Nace pagada porque se está cobrando en este instante
                    };
                    multasNuevasGeneradas.Add(nuevaMora);
                    pagoMultas.Add(new PagoMulta { Multa = nuevaMora, Pago = nuevoPago });
                }

                mensualidad.Estado = Estado.Pagado;
                pagoMensualidades.Add(new PagoMensualidad { Mensualidad = mensualidad, Pago = nuevoPago });
            }
        }

        // 2. Procesar Multas explícitas que vengan del Frontend
        if (request.MultasIds.Any())
        {
            multasExistentesAPagar = (await _multaRepository.ObtenerPorIdsAsync(request.MultasIds)).ToList();
            foreach (var multa in multasExistentesAPagar)
            {
                if (multa.Estado == Estado.Pagado)
                    throw new InvalidOperationException($"La multa {multa.IdMulta} ya está pagada.");

                multa.Estado = Estado.Pagado;
                pagoMultas.Add(new PagoMulta { Multa = multa, Pago = nuevoPago });
            }
        }

        // 3. Procesar Conexiones
        if (request.ConexionesIds.Any())
        {
            conexionesAPagar = (await _conexionRepository.ObtenerPorIdsAsync(request.ConexionesIds)).ToList();
            foreach (var conexion in conexionesAPagar)
            {
                if (conexion.Estado == Estado.Pagado)
                    throw new InvalidOperationException($"La conexión {conexion.IdConexion} ya está pagada.");

                conexion.Estado = Estado.Pagado;
                pagoConexiones.Add(new PagoConexion { Conexion = conexion, Pago = nuevoPago });
            }
        }

        // 4. Guardar archivo físico si existe
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

        // 5. Enviar a Infraestructura
        await _pagoRepository.RegistrarPagoMasivoAsync(
            nuevoPago, 
            nuevoComprobante, 
            pagoMensualidades, 
            pagoMultas, 
            pagoConexiones, 
            mensualidadesAPagar,
            multasExistentesAPagar,
            conexionesAPagar,
            multasNuevasGeneradas // Pasamos las moras nuevas
        );
    }

    public async Task<IEnumerable<IngresoResponse>> ObtenerHistorialIngresosAsync(FiltrarIngresosRequest filtros)
    {
        var pagos = await _pagoRepository.ObtenerHistorialPagosAsync();
        IEnumerable<IngresoResponse> result = pagos.Select(MapToIngresoResponse);

        if (filtros.TipoPago.HasValue)
            result = result.Where(r => r.TipoIngreso.Contains(filtros.TipoPago.Value.ToString(), StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrWhiteSpace(filtros.Estado))
            result = result.Where(r => r.Estado.Equals(filtros.Estado, StringComparison.OrdinalIgnoreCase));
        if (filtros.Desde.HasValue)
            result = result.Where(r => r.Fecha >= filtros.Desde.Value);
        if (filtros.Hasta.HasValue)
            result = result.Where(r => r.Fecha <= filtros.Hasta.Value);

        return result;
    }

    public async Task<IEnumerable<HistorialPagoUsuarioResponse>> ObtenerHistorialPorUsuarioAsync(int idUsuario, DateTime? desde, DateTime? hasta)
    {
        var pagos = await _pagoRepository.ObtenerHistorialPorUsuarioAsync(idUsuario, desde, hasta);
        return pagos.Select(MapToHistorialUsuarioResponse);
    }

    public async Task<DetallePagoResponse> ObtenerDetallePagoModalAsync(int idPago)
    {
        var p = await _pagoRepository.ObtenerPagoPorIdConDetallesAsync(idPago)
            ?? throw new KeyNotFoundException($"No se encontró el pago con ID {idPago}");

        // Obtener el titular del pago buscando de forma segura en las deudas pagadas
        Usuario? usuario = p.PagoMensualidades?.FirstOrDefault()?.Mensualidad?.Usuario 
                        ?? p.PagoMultas?.FirstOrDefault()?.Multa?.Usuario 
                        ?? p.PagoConexiones?.FirstOrDefault()?.Conexion?.Usuario;

        Domicilio? domicilio = usuario?.DomicilioUsuarios?.FirstOrDefault()?.Domicilio 
                            ?? p.PagoConexiones?.FirstOrDefault()?.Conexion?.Domicilio;

        if (usuario?.Persona == null)
            throw new InvalidOperationException("El pago no cuenta con relaciones que apunten a un titular de cuenta válido.");

        // Reconstrucción dinámica del tipo de pago (Soporta multipagos)
        var tiposList = new List<string>();
        if (p.PagoMensualidades?.Any() == true) tiposList.Add("Mensualidad");
        if (p.PagoMultas?.Any() == true) tiposList.Add("Multa");
        if (p.PagoConexiones?.Any() == true) tiposList.Add("Conexión");
        string tipoPagoReconstruido = tiposList.Any() ? string.Join(", ", tiposList) : "Varios";

        var lineas = new List<LineaPagoResponse>();

        foreach (var pm in p.PagoMensualidades ?? [])
        {
            lineas.Add(new LineaPagoResponse
            {
                Concepto = pm.Mensualidad.PeriodoPago.HasValue
                             ? $"Mensualidad {pm.Mensualidad.PeriodoPago.Value:MMMM yyyy}"
                             : "Mensualidad",
                FechaVencimiento = pm.Mensualidad.FechaVencimiento,
                MontoBase = pm.Mensualidad.Monto,
                Mora = 0m,
                Tipo = "mensualidad",
            });
        }

        foreach (var pm in p.PagoMultas ?? [])
        {
            lineas.Add(new LineaPagoResponse
            {
                Concepto = pm.Multa.TipoMulta?.Descripcion ?? "Multa por Infracción",
                FechaVencimiento = null,
                MontoBase = pm.Multa.Monto,
                Mora = 0m,
                Tipo = "multa",
            });
        }

        foreach (var pc in p.PagoConexiones ?? [])
        {
            lineas.Add(new LineaPagoResponse
            {
                Concepto = "Servicio/Reconexión de Red",
                FechaVencimiento = null,
                MontoBase = pc.Conexion.Monto,
                Mora = 0m,
                Tipo = "conexion"
            });
        }

        return new DetallePagoResponse
        {
            Titular = $"{usuario.Persona.PrimerNombre} {usuario.Persona.PrimerApellido}",
            Dni = usuario.Persona.Dni,
            NumeroComprobante = p.Comprobante?.Codigo.ToString() ?? $"PGO-{p.IdPago}",
            Calle = domicilio?.Calle.ToString() ?? "N/A",
            Bloque = domicilio?.CodigoBloque.ToString() ?? "N/A",
            Lote = domicilio?.LoteCasa ?? 0,
            MetodoPago = p.MetodoPago.ToString(),
            CodigoTransferencia = p.MetodoPago == MetodoPago.Transferencia ? p.Comprobante?.Codigo.ToString() : null,
            Fecha = p.FechaPago,
            TipoPago = tipoPagoReconstruido,
            Estado = p.Estado.ToString(),
            MontoTotal = p.Monto,
            Lineas = lineas,
            ComentarioRechazo = p.ComentarioRechazo,
            UrlComprobante = p.Comprobante?.Url,
        };
    }

    private static IngresoResponse MapToIngresoResponse(Pago p)
    {
        Usuario? usuario = p.PagoMensualidades?.FirstOrDefault()?.Mensualidad?.Usuario 
                        ?? p.PagoMultas?.FirstOrDefault()?.Multa?.Usuario 
                        ?? p.PagoConexiones?.FirstOrDefault()?.Conexion?.Usuario;

        var tiposList = new List<string>();
        if (p.PagoMensualidades?.Any() == true) tiposList.Add("Mensualidad");
        if (p.PagoMultas?.Any() == true) tiposList.Add("Multa");
        if (p.PagoConexiones?.Any() == true) tiposList.Add("Conexión");
        string tipoPagoReconstruido = tiposList.Any() ? string.Join(", ", tiposList) : "Otros";

        var estadoDisplay = p.Estado switch
        {
            EstadoAprobacion.EnRevision => "En revisión",
            EstadoAprobacion.Aprobado   => "Procesado",
            EstadoAprobacion.Rechazado  => "Rechazado",
            _ => "En revisión"
        };

        return new IngresoResponse
        {
            Id = p.IdPago,
            Codigo = p.Comprobante?.Codigo.ToString() ?? $"PGO-{p.IdPago}",
            TipoIngreso = tipoPagoReconstruido,
            Titular = usuario?.Persona != null ? $"{usuario.Persona.PrimerNombre} {usuario.Persona.PrimerApellido}" : "N/A",
            Dni = usuario?.Persona?.Dni ?? "N/A",
            Fecha = p.FechaPago,
            Monto = p.Monto,
            Estado = estadoDisplay,
        };
    }

    private static HistorialPagoUsuarioResponse MapToHistorialUsuarioResponse(Pago p)
    {
        var tiposList = new List<string>();
        if (p.PagoMensualidades?.Any() == true) tiposList.Add("Mensualidad");
        if (p.PagoMultas?.Any() == true) tiposList.Add("Multa");
        if (p.PagoConexiones?.Any() == true) tiposList.Add("Conexión");
        string tipoPagoReconstruido = tiposList.Any() ? string.Join(", ", tiposList) : "Varios";

        var responsable = p.Registrador?.Persona != null
            ? $"{p.Registrador.Persona.PrimerNombre} {p.Registrador.Persona.PrimerApellido}"
            : "Sistema";

        return new HistorialPagoUsuarioResponse
        {
            Id = p.IdPago,
            Codigo = p.Comprobante?.Codigo.ToString() ?? $"PGO-{p.IdPago}",
            Fecha = p.FechaPago,
            Monto = p.Monto,
            TipoPago = tipoPagoReconstruido,
            MetodoPago = p.MetodoPago.ToString(),
            Responsable = responsable,
            Estado = p.Estado.ToString(),
        };
    }

    public async Task AprobarPagoAsync(int idPago, AprobarPagoRequest request) => await _pagoRepository.AprobarAsync(idPago, request.AprobadoPor);
    public async Task RechazarPagoAsync(int idPago, RechazarPagoRequest request) => await _pagoRepository.RechazarAsync(idPago, request.Motivo);
}