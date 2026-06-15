using JAV_API.Domain.Entities;
using JAV_API.Domain.Enums;
using Xunit;

namespace JAV_API.Domain.Tests;

public class EgresoTests
{
    [Fact]
    public void NuevoEgreso_EstadoInicialEsEnRevision()
    {
        // Arrange
        var egreso = new Egreso();

        // Act
        var estado = egreso.Estado;

        // Assert
        Assert.Equal(EstadoAprobacion.EnRevision, estado);
    }

    [Fact]
    public void NuevoEgreso_AprobadoPorEsNulo()
    {
        // Arrange
        var egreso = new Egreso();

        // Assert
        Assert.Null(egreso.AprobadoPor);
    }

    [Fact]
    public void NuevoEgreso_TituloDescripcionYUrlNoSonNulos()
    {
        // Arrange
        var egreso = new Egreso();

        // Assert
        Assert.NotNull(egreso.Titulo);
        Assert.NotNull(egreso.Descripcion);
        Assert.NotNull(egreso.Url);
    }

    [Fact]
    public void Egreso_AsignarMonto_MontoEsCorrecto()
    {
        // Arrange
        var egreso = new Egreso();

        // Act
        egreso.Monto = 500.00m;

        // Assert
        Assert.Equal(500.00m, egreso.Monto);
    }

    [Fact]
    public void Egreso_CambiarEstadoAAprobado_EstadoActualizado()
    {
        // Arrange
        var egreso = new Egreso();

        // Act
        egreso.Estado = EstadoAprobacion.Aprobado;

        // Assert
        Assert.Equal(EstadoAprobacion.Aprobado, egreso.Estado);
    }

    [Fact]
    public void Egreso_CambiarEstadoARechazado_EstadoActualizado()
    {
        // Arrange
        var egreso = new Egreso();

        // Act
        egreso.Estado = EstadoAprobacion.Rechazado;

        // Assert
        Assert.Equal(EstadoAprobacion.Rechazado, egreso.Estado);
    }

    [Fact]
    public void Egreso_MontoEnCero_EsAsignableComoValorBorde()
    {
        // Arrange
        var egreso = new Egreso();

        // Act
        egreso.Monto = 0m;

        // Assert
        Assert.Equal(0m, egreso.Monto);
    }
}
