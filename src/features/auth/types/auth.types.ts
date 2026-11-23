export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** Respuesta esperada del backend en login/register. Ajústala a tu API. */
export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthSession {
  token: string;
  user: User;
}

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}
