using System;
using System.IO;
using JAV_API.Application.Interfaces;

namespace JAV_API.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    public async Task<string> GuardarArchivoAsync(Stream archivoStream, string nombreArchivo)
    {
        if (archivoStream == Stream.Null || archivoStream.Length == 0)
        {
            throw new ArgumentException("El flujo del archivo está vacío o es inválido.");
        }

        // Definir la ruta física de la carpeta de subidas en el servidor
        var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        
        // Crear el directorio si no existe
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }

        // Crear un nombre único usando GUID para evitar colisiones de archivos con el mismo nombre
        var fileName = $"{Guid.NewGuid()}_{nombreArchivo}";
        var filePath = Path.Combine(uploadPath, fileName);

        // Guardar el Stream directamente al disco duro
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await archivoStream.CopyToAsync(stream);
        }

        // Retornar la URL relativa para que el middleware de archivos estáticos la sirva
        return $"/uploads/{fileName}";
    }
}