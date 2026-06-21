import { ROUTES } from './routes'

export const ROUTE_LABELS: Record<string, string> = {
  [ROUTES.DASHBOARD]:                 'Dashboard',

  [ROUTES.INGRESOS]:                  'Ingresos',
  [ROUTES.INGRESOS_REGISTRAR]:        'Registrar cobro',
  [ROUTES.INGRESOS_HISTORIAL]:        'Historial de ingresos',

  [ROUTES.EGRESOS]:                   'Egresos',
  [ROUTES.EGRESOS_REGISTRAR]:         'Registrar egreso',
  [ROUTES.EGRESOS_HISTORIAL]:         'Historial de egresos',

  //[ROUTES.CAJA]:                      'Caja',

  [ROUTES.CLIENTES]:                  'Clientes',
 // [ROUTES.CLIENTES_LISTADO]:          'Listado de clientes',
  [ROUTES.CLIENTES_MULTAS]:           'Multas',

  [ROUTES.REPORTES]:                  'Reportes',
  [ROUTES.REPORTES_FINANCIERO]:       'Reporte financiero',
  //[ROUTES.REPORTES_INGRESOS]:         'Ingresos',
  //[ROUTES.REPORTES_EGRESOS]:          'Egresos',

 // [ROUTES.VALIDACIONES]:              'Validaciones',
 // [ROUTES.VALIDACIONES_CIERRES]:      'Cierres pendientes',
 // [ROUTES.VALIDACIONES_HISTORIAL]:    'Historial de cierres',

  //[ROUTES.SUPERVISION]:               'Supervisión',
 // [ROUTES.SUPERVISION_CIERRES]:       'Cierres de caja',

  [ROUTES.AJUSTES]:                   'Ajustes',
  [ROUTES.AJUSTES_TARIFA_ING]:        'Tarifa de ingresos',
 // [ROUTES.AJUSTES_TARIFA_EGR]:        'Tarifa de egresos',

  [ROUTES.USUARIOS]:                  'Gestionar usuarios',
  [ROUTES.PERFIL]:                    'Perfil',
  [ROUTES.UNAUTHORIZED]:              'No autorizado',
}