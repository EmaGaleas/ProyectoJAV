using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using Xunit;

namespace JAV_API.Domain.Tests;

public class PagoTests
{
    [Fact]
    public void NuevoPago_EstadoInicialEsEnRevision()
    {
        // Arrange
        var pago = new Pago();

        // Act
        var estado = pago.Estado;

        // Assert
        Assert.Equal(EstadoAprobacion.EnRevision, estado);
    }

    [Fact]
    public void NuevoPago_AprobadoPorEsNulo()
    {
        // Arrange
        var pago = new Pago();

        // Assert
        Assert.Null(pago.AprobadoPor);
    }

    [Fact]
    public void NuevoPago_ColeccionesNoSonNulas()
    {
        // Arrange
        var pago = new Pago();

        // Assert
        Assert.NotNull(pago.PagoMensualidades);
        Assert.NotNull(pago.PagoMultas);
        Assert.NotNull(pago.PagoConexiones);
    }

    [Fact]
    public void NuevoPago_ColeccionesInicianVacias()
    {
        // Arrange
        var pago = new Pago();

        // Assert
        Assert.Empty(pago.PagoMensualidades);
        Assert.Empty(pago.PagoMultas);
        Assert.Empty(pago.PagoConexiones);
    }

    [Fact]
    public void Pago_AsignarMonto_MontoEsCorrecto()
    {
        // Arrange
        var pago = new Pago();

        // Act
        pago.Monto = 250.00m;

        // Assert
        Assert.Equal(250.00m, pago.Monto);
    }

    [Fact]
    public void Pago_AsignarMetodoPagoEfectivo_MetodoEsCorrecto()
    {
        // Arrange
        var pago = new Pago();

        // Act
        pago.MetodoPago = MetodoPago.Efectivo;

        // Assert
        Assert.Equal(MetodoPago.Efectivo, pago.MetodoPago);
    }

    [Fact]
    public void Pago_AsignarMetodoPagoTransferencia_MetodoEsCorrecto()
    {
        // Arrange
        var pago = new Pago();

        // Act
        pago.MetodoPago = MetodoPago.Transferencia;

        // Assert
        Assert.Equal(MetodoPago.Transferencia, pago.MetodoPago);
    }

    [Fact]
    public void Pago_CambiarEstadoAAprobado_EstadoActualizado()
    {
        // Arrange
        var pago = new Pago();

        // Act
        pago.Estado = EstadoAprobacion.Aprobado;

        // Assert
        Assert.Equal(EstadoAprobacion.Aprobado, pago.Estado);
    }
}
