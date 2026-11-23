import { env } from "../../../config/env";
import { request } from "../../../lib/http";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types/auth.types";
import { mockAuthService } from "./auth.mock";

// Cambia estas rutas para adaptarlas a tu API.
const realAuthService = {
  login: (data: LoginRequest) => request<AuthResponse>("POST", "/auth/login", data),
  register: (data: RegisterRequest) => request<AuthResponse>("POST", "/auth/register", data),
  me: () => request<User>("GET", "/auth/me"),
};

export const authService = env.useMockAuth ? mockAuthService : realAuthService;
