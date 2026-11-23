import { HttpError } from "../../../lib/http";
import { sessionStorageService } from "../../../lib/storage";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth.types";

/**
 * Backend simulado para desarrollar sin API.
 * Se activa cuando VITE_API_URL está vacío o VITE_USE_MOCK_AUTH=true.
 *
 * Usuarios de prueba:
 *   admin@demo.com / admin123  (roles: user, admin)
 *   user@demo.com  / user123   (roles: user)
 */
const users: Array<User & { password: string }> = [
  { id: "1", name: "Admin", email: "admin@demo.com", password: "admin123", roles: ["user", "admin"] },
  { id: "2", name: "User", email: "user@demo.com", password: "user123", roles: ["user"] },
];

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const toPublic = ({ id, name, email, roles }: User): User => ({ id, name, email, roles });
const fakeToken = (u: User) => `mock.${btoa(u.id)}.${Date.now()}`;

export const mockAuthService = {
  async login({ email, password }: LoginRequest): Promise<AuthResponse> {
    await delay();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new HttpError(401, "Credenciales inválidas");
    const user = toPublic(found);
    return { token: fakeToken(user), user };
  },

  async register({ name, email, password }: RegisterRequest): Promise<AuthResponse> {
    await delay();
    if (users.some((u) => u.email === email)) {
      throw new HttpError(409, "El email ya está registrado");
    }
    const created = { id: String(users.length + 1), name, email, password, roles: ["user" as const] };
    users.push(created);
    const user = toPublic(created);
    return { token: fakeToken(user), user };
  },

  async me(): Promise<User> {
    await delay(150);
    const session = sessionStorageService.get();
    if (!session) throw new HttpError(401, "Sin sesión");
    return session.user;
  },
};
