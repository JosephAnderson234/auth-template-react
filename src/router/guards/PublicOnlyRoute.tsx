import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth";
import { FullPageLoader } from "../../shared/components/FullPageLoader";
import { DEFAULT_PRIVATE_PATH } from "../paths";

/**
 * Guard para rutas que solo deben ver usuarios SIN sesión (login, register).
 * Si ya está autenticado, lo manda al área privada.
 */
export function PublicOnlyRoute({ redirectTo = DEFAULT_PRIVATE_PATH }: { redirectTo?: string }) {
  const { status } = useAuth();

  if (status === "checking") return <FullPageLoader />;
  if (status === "authenticated") return <Navigate to={redirectTo} replace />;

  return <Outlet />;
}
