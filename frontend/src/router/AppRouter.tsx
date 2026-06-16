import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import LoginPage from "../features/auth/Login";
import { SidebarLayout } from "../layouts/SidebarLayout/SidebarLayout";
import { PaymentRegistration } from "../features/ingresos/components/PaymentRegistration";
import RegistrarEgresos from "../features/egresos/RegistrarEgreso";
import { IncomeHistory } from "../features/historial/ingresos/IncomeHistory";
import HistorialEgresos from "../features/historial/egresos/HistorialEgresos";
import { ConfiguracionCobros } from "../features/configuracion/ConfiguracionCobros";
import GestionarUsuarios from "../features/gestionUsuarios/GestionarUsuarios";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* ── Rutas Públicas ── */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* ── Rutas Privadas Protegidas ── */}
      <Route element={<PrivateRoute />}>
        <Route element={<SidebarLayout />}>
          
          {/* Acceso Universal (Todos los roles autenticados) 
              Incluye Dueño de casa (que solo ve perfil) */}
          {/* MEJORA: Redirección al Perfil en lugar de pantalla en blanco si no hay Dashboard */}
          <Route index element={<Navigate to={ROUTES.PERFIL} replace />} />
          <Route path={ROUTES.PERFIL} element={<></>} />

          {/* ── Grupo: Tesorero + SuperAdministrador ── */}
          <Route
            element={
              <RoleRoute allowedRoles={["Tesorero", "SuperAdministrador"]} />
            }
          >
            {/* Ingresos y Egresos (Registrar) */}
            <Route path={ROUTES.INGRESOS_REGISTRAR} element={<PaymentRegistration />} />
            <Route path={ROUTES.EGRESOS_REGISTRAR} element={<RegistrarEgresos />} />
            
            {/* Clientes: Movido aquí porque Tesorero y SuperAdmin sí lo ven, pero Administrador NO */}
            {/* <Route path={ROUTES.CLIENTES_LISTADO} element={<></>} /> */}
            <Route path={ROUTES.CLIENTES_MULTAS} element={<></>} />
            
            {/* CAJA comentada según requerimiento */}
            {/* <Route path="/caja" element={<></>} /> */}
          </Route>

          {/* ── Grupo Historiales y Reportes: Tesorero + Fiscal + Administrador + SuperAdministrador ── */}
          <Route
            element={
              <RoleRoute
                allowedRoles={["Tesorero", "Fiscal", "Administrador", "SuperAdministrador"]}
              />
            }
          >
            {/* Historiales de Ingresos y Egresos */}
            <Route path={ROUTES.INGRESOS_HISTORIAL} element={<IncomeHistory />} />
            <Route path={ROUTES.EGRESOS_HISTORIAL} element={<HistorialEgresos />} />

            {/* Reportes: Solo el financiero activo actualmente */}
            <Route path={ROUTES.REPORTES_FINANCIERO} element={<></>} />
            {/* Comentados temporalmente por desarrollo */}
            {/* <Route path={ROUTES.REPORTES_INGRESOS} element={<></>} /> */}
            {/* <Route path={ROUTES.REPORTES_EGRESOS} element={<></>} /> */}
          </Route>

          {/* ── Grupo: Solo Fiscal (Validaciones) ── */}
          <Route element={<RoleRoute allowedRoles={["Fiscal"]} />}>
           {/* <Route path={ROUTES.VALIDACIONES_CIERRES} element={<></>} />*/}
           {/*<Route path={ROUTES.VALIDACIONES_HISTORIAL} element={<></>} />*/}
                     </Route>

          {/* ── Grupo: Administrador + SuperAdministrador ── */}
          <Route
            element={
              <RoleRoute allowedRoles={["Administrador", "SuperAdministrador"]} />
            }
          >
            {/* Gestión de usuarios */}
            <Route path={ROUTES.USUARIOS} element={<GestionarUsuarios />} />
            
            {/* NOTA: ROUTES.CLIENTES_LISTADO fue removido de este bloque 
                porque para el Administrador debe estar comentado/deshabilitado */}
          </Route>

          {/* ── Grupo: Solo SuperAdministrador (Ajustes y Supervisión) ── */}
          <Route element={<RoleRoute allowedRoles={["SuperAdministrador"]} />}>
            <Route path={ROUTES.AJUSTES_TARIFA_ING} element={<ConfiguracionCobros />} />
            {/* <Route path={ROUTES.AJUSTES_TARIFA_EGR} element={<></>} /> */}
            {/* <Route path={ROUTES.SUPERVISION_CIERRES} element={<></>} /> */}
          </Route>

        </Route>
      </Route>

      {/* ── Manejo de Errores y Redirecciones Galácticas ── */}
      <Route path={ROUTES.UNAUTHORIZED} element={<></>} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  </BrowserRouter>
);