import { useAuth } from "../features/auth";

export function DashboardPage() {
  const { user } = useAuth();
  return (
    <section>
      <h1>Dashboard</h1>
      <p>Ruta protegida. Hola, {user?.name}.</p>
    </section>
  );
}
