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
| Backend            | ASP.NET Core Web API (C#)   |
| Base de datos      | PostgreSQL                  |
| Auth               | JWT + ASP.NET Identity      |
| Contenedores       | Docker + Docker Compose     |
| CI/CD              | GitHub Actions              |
| Documentación API  | Swagger           |
| Gestión de tareas  | Trello                      |
| Diseño UI          | Figma                       |

## Requisitos previos

- Docker y Docker Compose
- Node.js >= ##
- .NET SDK >= ##
- PostgreSQL>= ## 

## Instalación y ejecución local

### Con Docker(recomendado)

```bash
#pendiente definir
docker compose up --build
```

Los servicios estarán disponibles en:
- Frontend: http://localhost:
- Backend API: http://localhost:
- Swagger: http://localhost:

### Sin Docker

**Frontend**
```bash
#pendiente por definir
```

**Backend**
```bash
#pendiente por definir

```

## Variables de entorno

*Nunca subir el archivo `.env` al repositorio.*

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