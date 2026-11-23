import { createBrowserRouter } from "react-router";
import { AuthLayout } from "../layouts/AuthLayout";
import { MainLayout } from "../layouts/MainLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { AdminPage } from "../pages/AdminPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ForbiddenPage } from "../pages/ForbiddenPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { PublicOnlyRoute } from "./guards/PublicOnlyRoute";
import { PATHS } from "./paths";

/**
 * Árbol de rutas. Para agregar una ruta:
 *  1. Agrega la URL en `paths.ts`
 *  2. Crea la página en `pages/` (o en `features/<modulo>/pages/`)
 *  3. Colócala dentro del grupo correcto: pública, solo-invitados, protegida o por rol
 */
export const router = createBrowserRouter([
  // ── Solo invitados (si hay sesión → redirige al dashboard) ──
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: PATHS.login, element: <LoginPage /> },
          { path: PATHS.register, element: <RegisterPage /> },
        ],
      },
    ],
  },

  // ── Layout principal ──
  {
    element: <MainLayout />,
    children: [
      // Públicas
      { path: PATHS.home, element: <HomePage /> },
      { path: PATHS.forbidden, element: <ForbiddenPage /> },

      // Protegidas (requieren sesión)
      {
        element: <ProtectedRoute />,
        children: [
          { path: PATHS.dashboard, element: <DashboardPage /> },
          { path: PATHS.profile, element: <ProfilePage /> },
        ],
      },

      // Protegidas por rol
      {
        element: <ProtectedRoute roles={["admin"]} />,
        children: [{ path: PATHS.admin, element: <AdminPage /> }],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
