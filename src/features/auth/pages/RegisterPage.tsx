import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { DEFAULT_PRIVATE_PATH, PATHS } from "../../../router/paths";
import { useAuth } from "../hooks/useAuth";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate(DEFAULT_PRIVATE_PATH, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Crear cuenta</h2>
      <label>
        Nombre
        <input value={form.name} onChange={update("name")} required autoComplete="name" />
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={update("email")} required autoComplete="email" />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          value={form.password}
          onChange={update("password")}
          required
          minLength={6}
          autoComplete="new-password"
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Creando…" : "Registrarme"}
      </button>
      <p className="muted">
        ¿Ya tienes cuenta? <Link to={PATHS.login}>Inicia sesión</Link>
      </p>
    </form>
  );
}
