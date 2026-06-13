[Fact]
public void ObtenerMontoPendiente_RetornaValorNoNegativo() {
    var sut = new VecinoService();
    var monto = sut.ObtenerMontoPendiente(1);
    Assert.True(monto >= 0);
}