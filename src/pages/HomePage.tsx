import { Link } from "react-router";
import { useAuth } from "../features/auth";
import { PATHS } from "../router/paths";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  return (
    <section>
      <h1>Bienvenido</h1>
      <p>Página pública. Cualquiera puede verla.</p>
      <p>
        {isAuthenticated ? (
          <Link to={PATHS.dashboard}>Ir al dashboard</Link>
        ) : (
          <Link to={PATHS.login}>Iniciar sesión</Link>
        )}
      </p>
    </section>
  );
}
