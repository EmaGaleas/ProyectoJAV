# Sistema de Administración para la Junta de Agua Villalinda

Sistema web para la gestión financiera y administrativa de una organización de servicio de agua en Villanueva, Cortés. Digitaliza el control de cobros, pagos, egresos, usuarios y reportes para mejorar la transparencia y organización interna.

## Módulos principales

- **Gestión de mensualidades** — Generación automática de cobros mensuales por cliente, con cálculo de recargos y multas según días de pago.
- **Control de ingresos y egresos** — Registro de movimientos financieros con carga de evidencia documental adjunta.
- **Flujo de aprobación** — Los egresos requieren aprobación del Presidente; los cierres de caja, validación del Fiscal.
- **Reportes financieros** — Generación de estados de cuenta, balances y reportes de auditoría exportables.
- **Notificaciones automáticas** — Envío de alertas de cobro y recordatorios de pago por correo electrónico.
- **Control de usuarios y roles** — Gestión de acceso con permisos diferenciados por rol de sistema.

## Roles del Sistema
 

| Rol | Responsabilidad | Accesos principales | Capacidades futuras |
|-----|-----------------|---------------------|---------------------|
| **Presidente** | Supervisar operaciones generales de la Junta | Reportes financieros, aprobación de egresos, administración de usuarios | Asignar montos/tipos de egresos y fechas de cobro |
| **Tesorero** | Gestión financiera diaria | Registrar ingresos, egresos con evidencia y pagos de residentes | Asignar multas a residentes |
| **Secretario** | Gestión de cobranza y contacto con residentes | Reportes de mora, generación de hojas de cobro | Notificaciones automáticas por correo |
| **Fiscal** | Supervisión y control de caja | - | Revisión de movimientos (solo lectura), validación y cierre contable mensual |
| **Dueño de Casa** | Beneficiario del servicio de agua potable | *(Previsto para fase posterior al MVP)* | Consulta de estado de cuenta e historial de pagos |
| **Administrador** | Gestión técnica de la plataforma | Gestión de usuarios tipo Dueño de Casa | Acceso a reportes del sistema |
> **Nota:** El rol Dueño de Casa está definido en el modelo de datos desde el MVP para incorporarse en la siguiente fase sin cambios de arquitectura.
---

## Stack Tecnológico y Decisiones de Diseño
 
| Capa | Tecnología | Versión | 
|------|------------|---------|
| Lenguaje Backend | **C#** | .NET 8 | 
| Lenguaje Frontend | **TypeScript** | 5.x |
| Backend Framework | **ASP.NET Core Web API** | 9.x |
| Frontend Framework | **React + Vite** | 
| Estilos | **Tailwind CSS** | 3.x | 
| Base de datos | **PostgreSQL** | 16 |
| ORM | **Entity Framework Core** | 9.0.0 |
| Autenticación | **JWT + ASP.NET Identity** | — | 
| Contenedores | **Docker + Docker Compose** | Docker 25+ |
| Gestor de paquetes | **pnpm** | v11 | 
| Pruebas Backend | **xUnit** | — | 
| Pruebas Frontend | **Vitest** | — | 
| CI | **GitHub Actions** | — | 
| Seguridad de deps | **Dependabot** | — |
| Documentación API | **Swagger / OpenAPI** | — |
 

## Arquitectura del Sistema
 
El backend sigue los principios de **Clean Architecture** con separación estricta de capas y orientación al dominio (DDD). Las dependencias fluyen siempre hacia adentro: las capas externas dependen de las internas, nunca al revés.
```
ProyectoJAV/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Pipeline CI: build, lint y pruebas en cada PR
│   │   └── dependabot.yml      # Actualización automática de dependencias
│   └── PULL_REQUEST_TEMPLATE.md
│
├── backend/
│   |── JAV.API/             # Controllers, middlewares y punto de entrada
│   │   ├── Controllers/           
│   │   ├── obj/               
│   │   └── Properties/ 
│   ├── JAV.Application/        # Casos de uso y DTOs
│   │   ├── DTos/           
│   │   ├── Interfaces/  
│   │   ├── Services/               
│   │   └── obj/ 
│   ├── JAV.Domain/             # Entidades y lógica de negocio pura
│   │   ├── Entities/           
│   │   ├── Enums/               
│   │   └── obj/ 
│   └── JAV.Infrastructure/     # Persistencia, identidad y servicios externos
│   │   ├── Migrations/           
│   │   ├── obj/           
│   │   ├── Persistence/  
│   │   ├── Repositories/               
│   │   └── Services/ 
│   ├── .dockerignore
│   ├── Dockerfile
│   └── JAV_API.sln
│
├── frontend/
│   ├── .vscode/
│   ├── dist/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/   
│   │   ├── features/           # Módulos por dominio (pagos, clientes, etc.)
│   │   ├── layouts/           
│   │   ├── lib/           
│   │   ├── pages/           
│   │   ├── router/             # Rutas con guards por rol
│   │   ├── services/           
│   │   ├── types/               
│   │   └── utils/ 
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tscongif.app.json
│   ├── tscongif.json
│   ├── tscongif.node.json
│   └── vite.config.ts
│
├── docker-compose.yml          # Orquestación de servicios
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
└── README.md 
```
---

## Requisitos Previos
 
### Con Docker (recomendado)
 
Solo necesitas **Docker Desktop** instalado. No es necesario tener Node.js, pnpm ni .NET en tu máquina.
 
| Herramienta | Versión mínima | Instalación |
|-------------|----------------|-------------|
| Docker Desktop | 25.0+ | [docs.docker.com/get-docker](https://docs.docker.com/get-docker/) |
 
### Sin Docker (desarrollo local)
 
| Herramienta | Versión mínima | Instalación |
|-------------|----------------|-------------|
| Node.js | 22 LTS | [nodejs.org](https://nodejs.org/) — Requerido para instalar pnpm |
| pnpm | 11 | `npm install -g pnpm@11` |
| .NET SDK | 8.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0) |
| PostgreSQL | 16 | [postgresql.org/download](https://www.postgresql.org/download/) |
 
> **Nota:** La herramienta `dotnet-ef` se instala por separado si necesitas ejecutar migraciones manualmente:
> ```bash
> dotnet tool install --global dotnet-ef
> ```
 
---
## ¿Cómo ejecutar el proyecto?

### 1. Clonar el repositorio
 
```bash
git clone https://github.com/EmaGaleas/ProyectoJAV.git
cd ProyectoJAV
```
### 2. Configurar variables de entorno
 
Copia el archivo de ejemplo y ajusta los valores para tu entorno local:
 
```bash
cp .env.example .env
```
 
Edita `.env` con tus valores (ver sección [Variables de Entorno](#variables-de-entorno) más abajo).
 
>  **Nunca subir el archivo `.env` al repositorio.** Está incluido en `.gitignore` por seguridad.
 
### 3. Instalar dependencias del frontend
 
```bash
cd frontend
pnpm install
cd ..
```
> Solo necesario para desarrollo sin Docker, o si quieres ejecutar tests/lint del frontend.
---
 
## Ejecución del Proyecto
 
### Con Docker (recomendado)
 
Desde la raíz del proyecto:
 
```bash
# Primera vez o cuando se modifican los Dockerfiles
docker compose up --build
# Siguientes ejecuciones (más rápido, sin rebuild)
docker compose up
``` 
Los servicios estarán disponibles en:
 
| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:80 | Aplicación React |
| Backend API | http://localhost:5000 | API RESTful ASP.NET Core |
| Swagger UI | http://localhost:5000/swagger | Documentación interactiva de la API |
| PostgreSQL | localhost:5432 | Base de datos (acceso interno entre contenedores) |
 
```bash
# Detener todos los servicios (preserva datos)
docker compose down
# Detener y eliminar volúmenes (BORRA la base de datos)
docker compose down -v
```
---
### Sin Docker
 
#### Backend
 
```bash
cd backend/JAV.WebAPI
# Restaurar dependencias NuGet
dotnet restore
# Aplicar migraciones de base de datos (requiere PostgreSQL corriendo)
dotnet ef database update --project ../JAV.Infrastructure
# Iniciar el servidor de desarrollo
dotnet run
```
 
El backend estará disponible en `http://localhost:5000` y Swagger en `http://localhost:5000/swagger`.
 
#### Frontend
 
```bash
cd frontend
# Instalar dependencias (solo primera vez)
pnpm install
# Iniciar servidor de desarrollo con HMR
pnpm dev
```
 
El frontend estará disponible en `http://localhost:5173`.
 
---
## Comandos del Frontend (pnpm)
 
> **No uses `npm install`** en este proyecto. El archivo `pnpm-lock.yaml` y la configuración estricta de pnpm pueden generar incompatibilidades si se mezclan gestores de paquetes.
 
| Acción | Comando |
|--------|---------|
| Instalar dependencias | `pnpm install` |
| Iniciar servidor de desarrollo | `pnpm dev` |
| Build de producción | `pnpm run build` |
| Vista previa del build | `pnpm run preview` |
| Ejecutar pruebas unitarias | `pnpm run test` |
| Ejecutar pruebas en modo watch | `pnpm run test:watch` |
| Linting del código | `pnpm run lint` |
| Agregar dependencia de producción | `pnpm add <paquete>` |
| Agregar dependencia de desarrollo | `pnpm add -D <paquete>` |
| Eliminar dependencia | `pnpm remove <paquete>` |
| Auditar vulnerabilidades | `pnpm audit` |
 
---
## Variables de entorno

Copia el archivo de ejemplo incluido en el repositorio y edita los valores:
 
```bash
cp .env.example
```
 
> **`.env` está en `.gitignore`.** Nunca lo subas al repositorio. El archivo `.env.example` (sin valores sensibles reales) es el único que se versiona.


| Variable                    | Descripción                                 |
|-----------------------------|---------------------------------------------|
| `DB_PORT`                   | Puerto externo de PostgreSQL                |
| `POSTGRES_USER`             | Usuario de la base de datos                 |
| `POSTGRES_PASSWORD`         | Contraseña de la base de datos              |
| `POSTGRES_DB`               | Nombre de la base de datos                  |
| `BACKEND_PORT`              | Puerto externo del backend                  |
| `FRONTEND_PORT`             | Puerto externo del frontend                 |
| `ASPNETCORE_ENVIRONMENT`    | `Development` o `Production`                |
| `JWT_SECRET`                | Clave secreta para firmar los JWT           |

## Flujo de trabajo

### Ramas principales
 
| Rama      | Propósito                                         |
| --------- | ------------------------------------------------- |
| `main`    | Código en producción, estable                     |
| `develop` | Integración de trabajo listo, pre-producción      |
 
### Ramas de trabajo
 
Todas salen de `develop` y se mergean de vuelta a `develop` vía PR.
 
| Patrón        | Cuándo usarla                                      |
| ------------- | -------------------------------------------------- |
| `feature/**`  | Funcionalidad nueva                                |
| `fix/**`      | Corrección de bug                                  |
| `hotfix/**`   | Fix urgente                                        |
| `refactor/**` | Reorganización de código sin cambiar comportamiento|

### Naming
 
```
tipo/descripcion-corta

Ejemplos:
feature/login-clientes
fix/calculo-recargos
hotfix/pago-en-linea-error
refactor/servicio-pagos
```
---

## Equipo de Desarrollo
 
Este sistema fue desarrollado como proyecto de vinculuación académica por el siguiente equipo:
 
| Nombre | GitHub |
|--------|--------|
| **Ema Galeas** | [@EmaGaleas](https://github.com/EmaGaleas) |
| **Daniel Flores** | [@MMwile](https://github.com/MMwile) |
| **Sandro Hérnandez** | [@sandro-70](https://github.com/sandro-70) |
| **Abrahamn Reyes** | [@AbrahamReyes08](https://github.com/AbrahamReyes08) |
| **Armando Borjas** | [@AJBorjas03](https://github.com/AJBorjas03) |

**Mención especial** al docente Gadi Orellana por guiarnos en el proyecto [GDriem](https://github.com/GDriem)
 
> Proyecto desarrollado dentro de la asignatura de Ingeniería de Software 1 — Universidad de San Pedro Sula, Honduras 2026.