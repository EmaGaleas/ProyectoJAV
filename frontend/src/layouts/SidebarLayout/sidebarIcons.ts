import type { FC, SVGProps } from 'react'

export type SvgIcon = FC<SVGProps<SVGSVGElement>>

// — Compartidos —
import AyudaIcon from '../../assets/icons/sidebar/compartido/ayuda.svg?react'
import CerrarSesionIcon from '../../assets/icons/sidebar/compartido/cerrar_sesion.svg?react'
import GestionarUsuariosIcon from '../../assets/icons/sidebar/compartido/gestionar_usuarios.svg?react'
import PerfilIcon from '../../assets/icons/sidebar/compartido/perfil.svg?react'
import DashboardIcon from '../../assets/icons/sidebar/compartido/dashboard.svg?react'
import HistorialIcon from '../../assets/icons/sidebar/compartido/historial.svg?react'
import ReportesIcon from '../../assets/icons/sidebar/compartido/reportes.svg?react'
import ClientesIcon from '../../assets/icons/sidebar/compartido/clientes.svg?react'

// — Dueño de casa —
import EstadoCuentaIcon from '../../assets/icons/sidebar/dueño_casa/estado_cuenta.svg?react'
import HistorialPagosIcon from '../../assets/icons/sidebar/dueño_casa/historial_de_pagos.svg?react'
import RealizarPagoIcon from '../../assets/icons/sidebar/dueño_casa/realizar_pago.svg?react'

// — Fiscal —
import ValidacionesIcon from '../../assets/icons/sidebar/fiscal/validaciones.svg?react'

// — Presidente —
import AjustesFinancierosIcon from '../../assets/icons/sidebar/presidente/ajustes_financieros.svg?react'
import SupervisionIcon from '../../assets/icons/sidebar/presidente/supervision.svg?react'

// — Tesorero / Presidente —
import CajaIcon from '../../assets/icons/sidebar/tesorero/caja.svg?react'

// — Tesorero —
import EgresosIcon from '../../assets/icons/sidebar/tesorero/egresos.svg?react'
import IngresosIcon from '../../assets/icons/sidebar/tesorero/ingresos.svg?react'
import ReportesTIcon from '../../assets/icons/sidebar/tesorero/reportes.svg?react'

// ─── Mapas ───────────────────────────────────────────────────────────────────

const SHARED_ICONS: Record<string, SvgIcon> = {
  ayuda: AyudaIcon,
  'cerrar sesión': CerrarSesionIcon,
  'gestionar usuarios': GestionarUsuariosIcon,
  perfil: PerfilIcon,
  dashboard: DashboardIcon,
  historial: HistorialIcon,
  reportes: ReportesIcon,
  clientes: ClientesIcon,
  caja: CajaIcon,
}

const ROLE_ICONS: Record<string, Record<string, SvgIcon>> = {
  Tesorero: {
    egresos: EgresosIcon,
    ingresos: IngresosIcon,
  },
  Fiscal: {
    validaciones: ValidacionesIcon,
  },
  Administrador: {
    // Usa iconos compartidos principalmente
  },
  SuperAdministrador: {
    'ajustes financieros': AjustesFinancierosIcon,
    supervisión: SupervisionIcon,
  },
  // Roles adicionales (compatibilidad)
  'dueño_casa': {
    'estado de cuenta': EstadoCuentaIcon,
    'historial de pagos': HistorialPagosIcon,
    'realizar pago': RealizarPagoIcon,
  },
}

// ─── Resolver ────────────────────────────────────────────────────────────────

export function resolveIcon(label: string, rol: string): SvgIcon {
  const key = label.toLowerCase().trim()
  return ROLE_ICONS[rol]?.[key] ?? SHARED_ICONS[key] ?? AyudaIcon
}