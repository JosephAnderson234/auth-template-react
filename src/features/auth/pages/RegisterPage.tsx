import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { DEFAULT_PRIVATE_PATH, PATHS } from "../../../router/paths";
import { useAuth } from "../hooks/useAuth";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await register({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      navigate(DEFAULT_PRIVATE_PATH, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Crear cuenta</h2>
      <input name="name" placeholder="Nombre" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Contraseña" minLength={6} required />
      {error && <p className="error">{error}</p>}
      <button type="submit">Registrarme</button>
      <p className="muted">
        ¿Ya tienes cuenta? <Link to={PATHS.login}>Inicia sesión</Link>
      </p>
    </form>
  );
}
