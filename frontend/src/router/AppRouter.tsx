import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import LoginPage from "../features/auth/Login";
import { SidebarLayout } from "../layouts/SidebarLayout/SidebarLayout";
import { PaymentRegistration } from "../features/ingresos/components/PaymentRegistration";
import RegistrarEgresos from "../features/RegistrarEgreso";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/*Pública*/}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/*Privadas*/}
      <Route element={<PrivateRoute />}>
        <Route element={<SidebarLayout />}>
          {/* Todos los roles autenticados */}
          <Route index element={<></>} />
          <Route path={ROUTES.PERFIL} element={<></>} />
          <Route path={ROUTES.AYUDA} element={<></>} />

          {/* ── Tesorero + SuperAdministrador ── */}
          <Route element={<RoleRoute allowedRoles={["Tesorero"]} />}>
            <Route
              path={ROUTES.INGRESOS_REGISTRAR}
              element={<PaymentRegistration />}
            />
            <Route path={ROUTES.INGRESOS_HISTORIAL} element={<></>} />
            <Route
              path={ROUTES.EGRESOS_REGISTRAR}
              element={
                <>
                  <RegistrarEgresos />
                </>
              }
            />
            <Route path={ROUTES.EGRESOS_HISTORIAL} element={<></>} />
            <Route path={ROUTES.CAJA} element={<></>} />
            <Route path={ROUTES.CLIENTES_LISTADO} element={<></>} />
            <Route path={ROUTES.CLIENTES_MULTAS} element={<></>} />
            <Route path={ROUTES.REPORTES_FINANCIERO} element={<></>} />
            <Route path={ROUTES.REPORTES_INGRESOS} element={<></>} />
            <Route path={ROUTES.REPORTES_EGRESOS} element={<></>} />
          </Route>

          {/*Fiscal */}
          <Route element={<RoleRoute allowedRoles={["Fiscal"]} />}>
            <Route path={ROUTES.VALIDACIONES_CIERRES} element={<></>} />
            <Route path={ROUTES.VALIDACIONES_HISTORIAL} element={<></>} />
          </Route>

          {/* Fiscal + SuperAdministrador + Administrador */}
          <Route
            element={
              <RoleRoute
                allowedRoles={["Fiscal", "SuperAdministrador", "Administrador"]}
              />
            }
          >
            <Route path={ROUTES.INGRESOS_HISTORIAL} element={<></>} />
            <Route path={ROUTES.EGRESOS_HISTORIAL} element={<></>} />
            <Route path={ROUTES.REPORTES_FINANCIERO} element={<></>} />
            <Route path={ROUTES.REPORTES_INGRESOS} element={<></>} />
            <Route path={ROUTES.REPORTES_EGRESOS} element={<></>} />
          </Route>

          {/* ── Administrador + SuperAdministrador ── */}
          <Route
            element={
              <RoleRoute
                allowedRoles={["Administrador", "SuperAdministrador"]}
              />
            }
          >
            <Route path={ROUTES.USUARIOS} element={<></>} />
            <Route path={ROUTES.CLIENTES_LISTADO} element={<></>} />
          </Route>

          {/* ── Solo SuperAdministrador ── */}
          <Route element={<RoleRoute allowedRoles={["SuperAdministrador"]} />}>
            <Route path={ROUTES.AJUSTES_TARIFA_ING} element={<></>} />
            <Route path={ROUTES.AJUSTES_TARIFA_EGR} element={<></>} />
            <Route path={ROUTES.SUPERVISION_EGRESOS} element={<></>} />
            <Route path={ROUTES.SUPERVISION_CIERRES} element={<></>} />
          </Route>
        </Route>
      </Route>

      {/*  Error */}
      <Route path={ROUTES.UNAUTHORIZED} element={<></>} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  </BrowserRouter>
);
