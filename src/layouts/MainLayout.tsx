import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../features/auth";
import { PATHS } from "../router/paths";

/** Layout general con barra de navegación. Envuelve rutas públicas y privadas. */
export function MainLayout() {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(PATHS.login, { replace: true });
  };

  return (
    <>
      <header className="navbar">
        <NavLink to={PATHS.home} className="brand">
          MiApp
        </NavLink>
        <nav>
          {isAuthenticated ? (
            <>
              <NavLink to={PATHS.dashboard}>Dashboard</NavLink>
              <NavLink to={PATHS.profile}>Perfil</NavLink>
              {hasRole("admin") && <NavLink to={PATHS.admin}>Admin</NavLink>}
              <span className="muted">{user?.name}</span>
              <button onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <NavLink to={PATHS.login}>Login</NavLink>
              <NavLink to={PATHS.register}>Registro</NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </>
  );
}
