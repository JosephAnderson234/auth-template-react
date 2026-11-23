import { sessionStorageService } from "../../../lib/storage";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types/auth.types";

/**
 * Backend falso para desarrollar sin API (se usa si VITE_API_URL está vacío).
 * Usuarios: admin@demo.com / admin123  —  user@demo.com / user123
 */
const users = [
  { id: "1", name: "Admin", email: "admin@demo.com", password: "admin123", roles: ["user", "admin"] },
  { id: "2", name: "User", email: "user@demo.com", password: "user123", roles: ["user"] },
] as Array<User & { password: string }>;

const toResponse = ({ id, name, email, roles }: User): AuthResponse => ({
  token: `mock-token-${id}`,
  user: { id, name, email, roles },
});

export const mockAuthService = {
  async login({ email, password }: LoginRequest) {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Credenciales inválidas");
    return toResponse(user);
  },

  async register({ name, email, password }: RegisterRequest) {
    if (users.some((u) => u.email === email)) throw new Error("El email ya está registrado");
    const user = { id: String(users.length + 1), name, email, password, roles: ["user"] } as User & { password: string };
    users.push(user);
    return toResponse(user);
  },

  async me() {
    const session = sessionStorageService.get();
    if (!session) throw new Error("Sin sesión");
    return session.user;
  },
};
