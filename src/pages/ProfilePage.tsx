import { useAuth } from "../features/auth";

export function ProfilePage() {
  const { user } = useAuth();
  return (
    <section>
      <h1>Perfil</h1>
      <pre className="code-block">{JSON.stringify(user, null, 2)}</pre>
    </section>
  );
}
