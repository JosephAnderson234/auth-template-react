import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { DEFAULT_PRIVATE_PATH, PATHS } from "../../../router/paths";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  // Si el guard nos mandó aquí, volvemos a la página que se quería abrir.
  const from = location.state?.from?.pathname ?? DEFAULT_PRIVATE_PATH;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await login({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Iniciar sesión</h2>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Contraseña" required />
      {error && <p className="error">{error}</p>}
      <button type="submit">Ingresar</button>
      <p className="muted">
        ¿No tienes cuenta? <Link to={PATHS.register}>Regístrate</Link>
      </p>
    </form>
  );
}
