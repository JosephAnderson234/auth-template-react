import { Link } from "react-router";
import { PATHS } from "../router/paths";

export function NotFoundPage() {
  return (
    <section>
      <h1>404</h1>
      <p>La página no existe.</p>
      <Link to={PATHS.home}>Volver al inicio</Link>
    </section>
  );
}
