import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES }        from './routes'
import { PrivateRoute }  from './PrivateRoute'
import { RoleRoute }     from './RoleRoute'
import LoginPage          from '../features/auth/Login'
import { SidebarLayout } from '../layouts/SidebarLayout/SidebarLayout'

// Página temporal de "En construcción" para las rutas que aún no tienen su vista lista
const WIP = ({ nombre }: { nombre: string }) => (
  <div style={{ padding: 24 }}>
    <h2>{nombre}</h2>
    <p style={{ color: '#888' }}>En construcción</p>
  </div>
)

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>

      {/* ── Pública ── */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* ── Privadas ── */}
      <Route element={<PrivateRoute />}>
        <Route element={<SidebarLayout />}>

          {/* Todos los roles autenticados */}
          <Route index                    element={<WIP nombre="Dashboard" />} />
          <Route path={ROUTES.PERFIL}     element={<WIP nombre="Perfil" />} />
          <Route path={ROUTES.AYUDA}      element={<WIP nombre="Ayuda" />} />

          {/* ── Tesorero + SuperAdministrador ── */}
          <Route element={<RoleRoute allowedRoles={['Tesorero', 'SuperAdministrador']} />}>
            <Route path={ROUTES.INGRESOS_REGISTRAR} element={<WIP nombre="Registrar cobro" />} />
            <Route path={ROUTES.INGRESOS_HISTORIAL} element={<WIP nombre="Historial de ingresos" />} />
            <Route path={ROUTES.EGRESOS_REGISTRAR}  element={<WIP nombre="Registrar egreso" />} />
            <Route path={ROUTES.EGRESOS_HISTORIAL}  element={<WIP nombre="Historial de egresos" />} />
            <Route path={ROUTES.CAJA}               element={<WIP nombre="Caja" />} />
            <Route path={ROUTES.CLIENTES_LISTADO}   element={<WIP nombre="Listado de clientes" />} />
            <Route path={ROUTES.CLIENTES_MULTAS}    element={<WIP nombre="Multas" />} />
            <Route path={ROUTES.REPORTES_FINANCIERO}element={<WIP nombre="Reporte financiero" />} />
            <Route path={ROUTES.REPORTES_INGRESOS}  element={<WIP nombre="Reportes - Ingresos" />} />
            <Route path={ROUTES.REPORTES_EGRESOS}   element={<WIP nombre="Reportes - Egresos" />} />
          </Route>

          {/* ── Fiscal ── */}
          <Route element={<RoleRoute allowedRoles={['Fiscal']} />}>
            <Route path={ROUTES.VALIDACIONES_CIERRES}   element={<WIP nombre="Cierres pendientes" />} />
            <Route path={ROUTES.VALIDACIONES_HISTORIAL} element={<WIP nombre="Historial de cierres" />} />
          </Route>

          {/* ── Fiscal + SuperAdministrador (historial y reportes de solo lectura) ── */}
          <Route element={<RoleRoute allowedRoles={['Fiscal', 'SuperAdministrador', 'Administrador']} />}>
            <Route path={ROUTES.INGRESOS_HISTORIAL} element={<WIP nombre="Historial de ingresos" />} />
            <Route path={ROUTES.EGRESOS_HISTORIAL}  element={<WIP nombre="Historial de egresos" />} />
            <Route path={ROUTES.REPORTES_FINANCIERO}element={<WIP nombre="Reporte financiero" />} />
            <Route path={ROUTES.REPORTES_INGRESOS}  element={<WIP nombre="Reportes - Ingresos" />} />
            <Route path={ROUTES.REPORTES_EGRESOS}   element={<WIP nombre="Reportes - Egresos" />} />
          </Route>

          {/* ── Administrador + SuperAdministrador ── */}
          <Route element={<RoleRoute allowedRoles={['Administrador', 'SuperAdministrador']} />}>
            <Route path={ROUTES.USUARIOS}         element={<WIP nombre="Gestionar usuarios" />} />
            <Route path={ROUTES.CLIENTES_LISTADO} element={<WIP nombre="Listado de clientes" />} />
          </Route>

          {/* ── Solo SuperAdministrador ── */}
          <Route element={<RoleRoute allowedRoles={['SuperAdministrador']} />}>
            <Route path={ROUTES.AJUSTES_TARIFA_ING}   element={<WIP nombre="Tarifa de ingresos" />} />
            <Route path={ROUTES.AJUSTES_TARIFA_EGR}   element={<WIP nombre="Tarifa de egresos" />} />
            <Route path={ROUTES.SUPERVISION_EGRESOS}  element={<WIP nombre="Supervisión - Egresos" />} />
            <Route path={ROUTES.SUPERVISION_CIERRES}  element={<WIP nombre="Supervisión - Cierres de caja" />} />
          </Route>

        </Route>
      </Route>

      {/* ── Error ── */}
      <Route path={ROUTES.UNAUTHORIZED} element={<WIP nombre="No autorizado" />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />

    </Routes>
  </BrowserRouter>
)