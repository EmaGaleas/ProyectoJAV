# ===== Etapa de Ejecución (Runtime) =====
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

# ===== Etapa de Construcción (SDK) =====
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar los archivos de proyecto (.csproj) de todas las capas para aprovechar la caché de Docker
COPY ["JAV_API/JAV_API.csproj", "JAV_API/"]
COPY ["JAV_API.Application/JAV_API.Application.csproj", "JAV_API.Application/"]
COPY ["JAV_API.Infrastructure/JAV_API.Infrastructure.csproj", "JAV_API.Infrastructure/"]
COPY ["JAV_API.Domain/JAV_API.Domain.csproj", "JAV_API.Domain/"]

# Restaurar dependencias de toda la solución
RUN dotnet restore "JAV_API/JAV_API.csproj"

# Copiar todo el código restante del backend
COPY . .

# Compilar y publicar la capa de la API
WORKDIR "/src/JAV_API"
RUN dotnet publish "JAV_API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ===== Etapa Final =====
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "JAV_API.dll"]