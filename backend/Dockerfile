# ===== Build Stage =====
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build

WORKDIR /src

# Copy project files
COPY . .

WORKDIR /src/JAV_API

# Restore dependencies (NuGet runs here automatically)
RUN dotnet restore

# Build and publish
RUN dotnet publish -c Release -o /app/publish

# ===== Runtime Stage =====
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview

WORKDIR /app

# Copy compiled output
COPY --from=build /app/publish .

# Expose port (must match docker-compose target port 8080)
EXPOSE 8080

# Start app
ENTRYPOINT ["dotnet", "JAV_API.dll"]