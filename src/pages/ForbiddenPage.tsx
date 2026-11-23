import { Link } from "react-router";
import { PATHS } from "../router/paths";

export function ForbiddenPage() {
  return (
    <section>
      <h1>403</h1>
      <p>No tienes permisos para ver esta página.</p>
      <Link to={PATHS.home}>Volver al inicio</Link>
    </section>
  );
}
