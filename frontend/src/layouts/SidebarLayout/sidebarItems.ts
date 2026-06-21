import { ROUTES } from '../../router/routes'
import type { Role } from '../../features/auth/types'

export interface SidebarChild {
  label: string
  path: string
  icon: null
}

export interface SidebarItem {
  label: string
  path: string
  icon: null
  children?: SidebarChild[]
}

export interface SidebarSection {
  section: 'Principales' | 'Otros' | 'Footer'
  items: SidebarItem[]
}

// Se usa Partial para evitar errores de TS si el tipo Role contiene más roles
// que aún no tienen configuración completa en este objeto.
export type SidebarConfig = Partial<Record<Role, SidebarSection[]>>

export const SIDEBAR_CONFIG: SidebarConfig = {
  /* ── DUEÑO DE CASA ─────────────────────────── */
    DuenoDeCasa: [
    {
      section: 'Otros',
      items: [{ label: 'Perfil', path: ROUTES.PERFIL, icon: null }],
    },
    {
      section: 'Footer',
      items: [
        { label: 'Cerrar Sesión', path: ROUTES.LOGIN, icon: null },
      ],
    },
  ],

  /* ── TESORERO ──────────────────────────────── */
  Tesorero: [
    {
      section: 'Principales',
      items: [
         { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: null }, // Comentado temporalmente
        {
          label: 'Ingresos',
          path: ROUTES.INGRESOS,
          icon: null,
          children: [
            { label: 'Registrar cobro', path: ROUTES.INGRESOS_REGISTRAR, icon: null },
            { label: 'Historial de ingresos', path: ROUTES.INGRESOS_HISTORIAL, icon: null },
          ],
        },
        {
          label: 'Egresos',
          path: ROUTES.EGRESOS,
          icon: null,
          children: [
            { label: 'Registrar egreso', path: ROUTES.EGRESOS_REGISTRAR, icon: null },
            { label: 'Historial de egresos', path: ROUTES.EGRESOS_HISTORIAL, icon: null },
          ],
        },
        // { label: 'Caja', path: ROUTES.CAJA, icon: null }, // Comentado según solicitud
        {
          label: 'Clientes',
          path: ROUTES.CLIENTES,
          icon: null,
          children: [
            // { label: 'Listado de clientes', path: ROUTES.CLIENTES_LISTADO, icon: null },
            { label: 'Multas', path: ROUTES.CLIENTES_MULTAS, icon: null },
          ],
        },
        {
          label: 'Reportes',
          path: ROUTES.REPORTES,
          icon: null,
          children: [
            { label: 'Reporte financiero', path: ROUTES.REPORTES_FINANCIERO, icon: null },
            // { label: 'Ingresos', path: ROUTES.REPORTES_INGRESOS, icon: null }, // Oculto temporalmente
            // { label: 'Egresos', path: ROUTES.REPORTES_EGRESOS, icon: null }, // Oculto temporalmente
          ],
        },
      ],
    },
    {
      section: 'Otros',
      items: [{ label: 'Perfil', path: ROUTES.PERFIL, icon: null }],
    },
    {
      section: 'Footer',
      items: [
        { label: 'Cerrar Sesión', path: ROUTES.LOGIN, icon: null },
      ],
    },
  ],

  /* ── FISCAL ────────────────────────────────── */
  Fiscal: [
    {
      section: 'Principales',
      items: [
        { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: null },
       // {
       //   label: 'Validaciones',
       //   path: ROUTES.VALIDACIONES,
       //   icon: null,
       //   children: [
       //     { label: 'Cierres pendientes', path: ROUTES.VALIDACIONES_CIERRES, icon: null },
       //     { label: 'Historial de cierres', path: ROUTES.VALIDACIONES_HISTORIAL, icon: null },
       //   ],
       // },
        {
          label: 'Historial',
          path: ROUTES.INGRESOS_HISTORIAL,
          icon: null,
          children: [
            { label: 'Historial de ingresos', path: ROUTES.INGRESOS_HISTORIAL, icon: null },
            { label: 'Historial de egresos', path: ROUTES.EGRESOS_HISTORIAL, icon: null },
          ],
        },
        {
          label: 'Reportes',
          path: ROUTES.REPORTES,
          icon: null,
          children: [
            { label: 'Reporte financiero', path: ROUTES.REPORTES_FINANCIERO, icon: null },
            // { label: 'Ingresos', path: ROUTES.REPORTES_INGRESOS, icon: null }, // Oculto
            // { label: 'Egresos', path: ROUTES.REPORTES_EGRESOS, icon: null }, // Oculto
          ],
        },
      ],
    },
    {
      section: 'Otros',
      items: [{ label: 'Perfil', path: ROUTES.PERFIL, icon: null }],
    },
    {
      section: 'Footer',
      items: [
        { label: 'Cerrar Sesión', path: ROUTES.LOGIN, icon: null },
      ],
    },
  ],

  /* ── ADMINISTRADOR ─────────────────────────── */
  Administrador: [
    {
      section: 'Principales',
      items: [
         { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: null }, // Comentado
        // { label: 'Clientes', path: ROUTES.CLIENTES_LISTADO, icon: null }, // Comentado según solicitud
        {
          label: 'Historial',
          path: ROUTES.INGRESOS_HISTORIAL,
          icon: null,
          children: [
            { label: 'Historial de ingresos', path: ROUTES.INGRESOS_HISTORIAL, icon: null },
            { label: 'Historial de egresos', path: ROUTES.EGRESOS_HISTORIAL, icon: null },
          ],
        },
        {
          label: 'Reportes',
          path: ROUTES.REPORTES,
          icon: null,
          children: [
            { label: 'Reporte financiero', path: ROUTES.REPORTES_FINANCIERO, icon: null },
            // { label: 'Ingresos', path: ROUTES.REPORTES_INGRESOS, icon: null }, // Oculto
            // { label: 'Egresos', path: ROUTES.REPORTES_EGRESOS, icon: null }, // Oculto
          ],
        },
      ],
    },
    {
      section: 'Otros',
      items: [
        { label: 'Gestionar usuarios', path: ROUTES.USUARIOS, icon: null },
        { label: 'Perfil', path: ROUTES.PERFIL, icon: null },
      ],
    },
    {
      section: 'Footer',
      items: [
        { label: 'Cerrar Sesión', path: ROUTES.LOGIN, icon: null },
      ],
    },
  ],

  /* ── SUPERADMINISTRADOR ────────────────────── */
  SuperAdministrador: [
    {
      section: 'Principales',
      items: [
        { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: null },
      //  {
      //    label: 'Clientes',
      //    path: ROUTES.CLIENTES,
      //    icon: null,
      //    children: [
      //     { label: 'Listado de clientes', path: ROUTES.CLIENTES_LISTADO, icon: null },
      //      { label: 'Multas', path: ROUTES.CLIENTES_MULTAS, icon: null },
      //    ],
      //  },
        {
          label: 'Historial',
          path: ROUTES.INGRESOS_HISTORIAL,
          icon: null,
          children: [
            { label: 'Historial de ingresos', path: ROUTES.INGRESOS_HISTORIAL, icon: null },
            { label: 'Historial de egresos', path: ROUTES.EGRESOS_HISTORIAL, icon: null },
          ],
        },
        {
          label: 'Reportes',
          path: ROUTES.REPORTES,
          icon: null,
          children: [
            { label: 'Reporte financiero', path: ROUTES.REPORTES_FINANCIERO, icon: null },
            // { label: 'Ingresos', path: ROUTES.REPORTES_INGRESOS, icon: null }, // Oculto
            // { label: 'Egresos', path: ROUTES.REPORTES_EGRESOS, icon: null }, // Oculto
          ],
        },
        {
          label: 'Ajustes financieros',
          path: ROUTES.AJUSTES,
          icon: null,
          children: [
            { label: 'Tarifa de ingresos', path: ROUTES.AJUSTES_TARIFA_ING, icon: null },
          //  { label: 'Tipos de egresos', path: ROUTES.AJUSTES_TARIFA_EGR, icon: null },
          ],
        },
//{
       //   label: 'Supervisión',
       //   path: ROUTES.SUPERVISION,
      //    icon: null,
//children: [{ label: 'Cierres de caja', path: ROUTES.SUPERVISION_CIERRES, icon: null }],
   //     },
      ],
    },
    {
      section: 'Otros',
      items: [
        { label: 'Gestionar usuarios', path: ROUTES.USUARIOS, icon: null },
        { label: 'Perfil', path: ROUTES.PERFIL, icon: null },
      ],
    },
    {
      section: 'Footer',
      items: [
        { label: 'Cerrar Sesión', path: ROUTES.LOGIN, icon: null },
      ],
    },
  ],
}