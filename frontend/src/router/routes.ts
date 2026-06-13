export const ROUTES = {
  LOGIN:        '/login',
  UNAUTHORIZED: '/no-autorizado',

  DASHBOARD:    '/',

  // Ingresos
  INGRESOS:               '/ingresos',
  INGRESOS_REGISTRAR:     '/ingresos/registrar',
  INGRESOS_HISTORIAL:     '/ingresos/historial',

  // Egresos
  EGRESOS:                '/egresos',
  EGRESOS_REGISTRAR:      '/egresos/registrar',
  EGRESOS_HISTORIAL:      '/egresos/historial',

  // Caja
  CAJA:                   '/caja',

  // Clientes
  CLIENTES:               '/clientes',
  CLIENTES_LISTADO:       '/clientes/listado',
  CLIENTES_MULTAS:        '/clientes/multas',

  // Reportes
  REPORTES:               '/reportes',
  REPORTES_FINANCIERO:    '/reportes/financiero',
  REPORTES_INGRESOS:      '/reportes/ingresos',
  REPORTES_EGRESOS:       '/reportes/egresos',

  // Validaciones (Fiscal)
  VALIDACIONES:           '/validaciones',
  VALIDACIONES_CIERRES:   '/validaciones/cierres-pendientes',
  VALIDACIONES_HISTORIAL: '/validaciones/historial-cierres',

  // Supervisión (SuperAdministrador)
  SUPERVISION:            '/supervision',
  SUPERVISION_CIERRES:    '/supervision/cierres-caja',

  // Ajustes financieros (SuperAdministrador)
  AJUSTES:                '/ajustes',
  AJUSTES_TARIFA_ING:     '/ajustes/tarifa-ingresos',
  AJUSTES_TARIFA_EGR:     '/ajustes/tipos-de-egresos',

  // Otros
  USUARIOS:               '/usuarios',
  PERFIL:                 '/perfil',
  AYUDA:                  '/ayuda',
} as const