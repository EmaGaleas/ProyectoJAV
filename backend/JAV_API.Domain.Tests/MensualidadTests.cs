using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using Xunit;

namespace JAV_API.Domain.Tests;

public class MensualidadTests
{
    [Fact]
    public void NuevaMensualidad_EstadoInicialEsPendiente()
    {
        // Arrange
        var mensualidad = new Mensualidad();

        // Act
        var estado = mensualidad.Estado;

        // Assert
        Assert.Equal(Estado.Pendiente, estado);
    }

    [Fact]
    public void NuevaMensualidad_ColeccionPagosNoEsNula()
    {
        // Arrange
        var mensualidad = new Mensualidad();

        // Assert
        Assert.NotNull(mensualidad.PagoMensualidades);
    }

    [Fact]
    public void NuevaMensualidad_ColeccionPagosIniciaVacia()
    {
        // Arrange
        var mensualidad = new Mensualidad();

        // Assert
        Assert.Empty(mensualidad.PagoMensualidades);
    }

    [Fact]
    public void NuevaMensualidad_PeriodoPagoEsNulo()
    {
        // Arrange
        var mensualidad = new Mensualidad();

        // Assert
        Assert.Null(mensualidad.PeriodoPago);
    }

    [Fact]
    public void NuevaMensualidad_FechaVencimientoEsNula()
    {
        // Arrange
        var mensualidad = new Mensualidad();

        // Assert
        Assert.Null(mensualidad.FechaVencimiento);
    }

    [Fact]
    public void Mensualidad_AsignarMonto_MontoEsCorrecto()
    {
        // Arrange
        var mensualidad = new Mensualidad();

        // Act
        mensualidad.Monto = 150.00m;

        // Assert
        Assert.Equal(150.00m, mensualidad.Monto);
    }

    [Fact]
    public void Mensualidad_CambiarEstadoAPagado_EstadoActualizado()
    {
        // Arrange
        var mensualidad = new Mensualidad();

        // Act
        mensualidad.Estado = Estado.Pagado;

        // Assert
        Assert.Equal(Estado.Pagado, mensualidad.Estado);
    }

    [Fact]
    public void Mensualidad_CambiarEstadoAVencido_EstadoActualizado()
    {
        // Arrange
        var mensualidad = new Mensualidad();

        // Act
        mensualidad.Estado = Estado.Vencido;

        // Assert
        Assert.Equal(Estado.Vencido, mensualidad.Estado);
    }
}
