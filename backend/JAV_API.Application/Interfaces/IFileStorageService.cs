namespace JAV_API.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> GuardarArchivoAsync(Stream archivoStream, string nombreArchivo);
}