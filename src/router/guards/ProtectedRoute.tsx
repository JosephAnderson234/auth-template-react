import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../features/auth";
import type { Role } from "../../features/auth";
import { FullPageLoader } from "../../shared/components/FullPageLoader";
import { DEFAULT_PUBLIC_PATH, PATHS } from "../paths";

interface ProtectedRouteProps {
  /** Si se indica, el usuario debe tener AL MENOS uno de estos roles. */
  roles?: Role[];
  /** A dónde redirigir si no hay sesión. */
  redirectTo?: string;
}

/**
 * Guard para rutas privadas. Úsalo como `element` de una ruta padre:
 *   { element: <ProtectedRoute />, children: [...] }
 *   { element: <ProtectedRoute roles={["admin"]} />, children: [...] }
 */
export function ProtectedRoute({ roles, redirectTo = DEFAULT_PUBLIC_PATH }: ProtectedRouteProps) {
  const { status, hasRole } = useAuth();
  const location = useLocation();

  if (status === "checking") return <FullPageLoader />;

  if (status === "unauthenticated") {
    // Guardamos la ruta para volver después del login.
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to={PATHS.forbidden} replace />;
  }

  return <Outlet />;
}
