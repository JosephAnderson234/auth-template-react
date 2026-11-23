import { env } from "../../../config/env";
import { api } from "../../../lib/http";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth.types";
import { mockAuthService } from "./auth.mock";

/**
 * Endpoints del backend. Cambia estas rutas para adaptarlas a tu API.
 */
const ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
} as const;

const realAuthService = {
  login: (data: LoginRequest) => api.post<AuthResponse>(ENDPOINTS.login, data),
  register: (data: RegisterRequest) => api.post<AuthResponse>(ENDPOINTS.register, data),
  /** Valida el token guardado y devuelve el usuario actual. */
  me: () => api.get<User>(ENDPOINTS.me),
};

export type AuthService = typeof realAuthService;

export const authService: AuthService = env.useMockAuth ? mockAuthService : realAuthService;
