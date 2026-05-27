# Sistema de Administración para la Junta de Agua Villalinda

Sistema web para la gestión financiera y administrativa de una organización de servicio de agua en Villanueva, Cortés. Digitaliza el control de cobros, pagos, egresos, usuarios y reportes para mejorar la transparencia y organización interna.

## Módulos principales

- Gestión de mensualidades, multas y recargos por cliente
- Pagos en línea y consulta de historial
- Registro de ingresos y egresos con evidencia documental
- Aprobación de egresos por presidente y validación de cierres por fiscal
- Generación de comprobantes únicos de pago
- Reportes financieros y auditoría de registros
- Notificaciones automáticas de cobro (correo)
- Control de usuarios y permisos por rol

## Stack tecnológico

| Área               | Tecnología                  |
| ------------------ | --------------------------- |
| Frontend           | React + TypeScript + Vite   |
| Gestor de paquetes | pnpm v11                  |
| Backend            | ASP.NET Core Web API (C#)   |
| Base de datos      | PostgreSQL                  |
| Auth               | JWT + ASP.NET Identity      |
| Contenedores       | Docker + Docker Compose     |
| CI/CD              | GitHub Actions              |
| Documentación API  | Swagger                     |
| Gestión de tareas  | Trello                      |
| Diseño UI          | Figma                       |

## Requisitos previos

| Herramienta   | Versión mínima | Para qué se usa                        |
|---------------|----------------|----------------------------------------|
| Docker Desktop | Última estable | Levantar todos los servicios           |
| Node.js       | 22             | Necesario para instalar pnpm           |
| pnpm          | 11             | Gestor de paquetes del frontend        |
| .NET SDK      | 8              | Desarrollo del backend sin Docker      |

> **Nota:** Con Docker no necesita instalar Node, pnpm ni .NET en su máquina para correr el proyecto. Solo son necesarios si desea desarrollar sin Docker.

## Instalación y ejecución local
### 1. Clonar el repositorio
 
```bash
git clone <https://github.com/EmaGaleas/ProyectoJAV >
cd <nombre-del-proyecto>
```
 
### 2. Configurar variables de entorno
Usar el `.env` compartido en la documentación y complete los valores. Nunca subir el `.env` al repositorio.

### 3. Instalar dependencias del frontend (solo primera vez)
 
```bash
cd frontend
pnpm install
cd ..
```
## Ejecución del proyecto

### Con Docker(recomendado)

Desde la raíz del proyecto:
 
```bash
# Primera vez o cuando cambia el Dockerfile
docker compose up --build
 
# Las siguientes veces (más rápido)
docker compose up
```
 
Los servicios estarán disponibles en:
 
| Servicio    | URL                                        |
|-------------|--------------------------------------------|
| Frontend    | http://localhost:`80`        |
| Backend API | http://localhost:`5000`         |
| Swagger     | http://localhost:`${BACKEND_PORT}`/swagger |

Para detener todos los servicios:
 
```bash
docker compose down
```
 
Para detener y eliminar los datos de la base de datos:
 
```bash
docker compose down -v
```

### Sin Docker

**Frontend**
```bash
#pendiente por definir
```

**Backend**
```bash
#pendiente por definir

```
## Comandos del frontend (pnpm)
 
Este proyecto usa **pnpm v11** como gestor de paquetes. No usar `npm install` directamente.
 
| Acción                        | Comando                  |
|-------------------------------|--------------------------|
| Instalar dependencias         | `pnpm install`           |
| Iniciar servidor de desarrollo| `pnpm dev`               |
| Build de producción           | `pnpm run build`         |
| Correr tests                  | `pnpm run test`          |
| Agregar una dependencia       | `pnpm add <paquete>`     |
| Agregar dependencia de dev    | `pnpm add -D <paquete>`  |
| Eliminar una dependencia      | `pnpm remove <paquete>`  |
 

## Variables de entorno

*Nunca subir el archivo `.env` al repositorio.*
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

## Estructura del proyecto

```
/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── frontend/               # React + Vite

├── backend/                # ASP.NET Core Web API
├── docker-compose.yml
├── .gitignore
└── README.md
```

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

## Roles del sistema

por definir

| Rol       | Acceso principal                                              |
| --------- | ------------------------------------------------------------- |

#