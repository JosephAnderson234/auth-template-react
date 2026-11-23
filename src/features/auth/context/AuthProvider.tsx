import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { UNAUTHORIZED_EVENT } from "../../../lib/http";
import { sessionStorageService } from "../../../lib/storage";
import { authService } from "../services/auth.service";
import type {
  AuthContextValue,
  AuthResponse,
  AuthStatus,
  LoginRequest,
  RegisterRequest,
  Role,
  User,
} from "../types/auth.types";
import { AuthContext } from "./auth.context";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Si hay sesión guardada empezamos en "checking" para validarla; si no, ya sabemos que no hay sesión.
  const [status, setStatus] = useState<AuthStatus>(() =>
    sessionStorageService.get() ? "checking" : "unauthenticated",
  );
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const startSession = useCallback(({ token, user }: AuthResponse) => {
    sessionStorageService.set({ token, user });
    setToken(token);
    setUser(user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    sessionStorageService.clear();
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Al cargar la app: restaurar sesión y validar el token contra el backend.
  useEffect(() => {
    const stored = sessionStorageService.get();
    if (!stored) return;
    let cancelled = false;
    authService
      .me()
      .then((freshUser) => {
        if (!cancelled) startSession({ token: stored.token, user: freshUser });
      })
      .catch(() => {
        if (!cancelled) logout();
      });
    return () => {
      cancelled = true;
    };
  }, [startSession, logout]);

  // Si cualquier request devuelve 401, cerrar sesión.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  const login = useCallback(
    async (data: LoginRequest) => startSession(await authService.login(data)),
    [startSession],
  );

  const register = useCallback(
    async (data: RegisterRequest) => startSession(await authService.register(data)),
    [startSession],
  );

  const hasRole = useCallback(
    (...roles: Role[]) => !!user && roles.some((r) => user.roles.includes(r)),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      token,
      isAuthenticated: status === "authenticated",
      login,
      register,
      logout,
      hasRole,
    }),
    [status, user, token, login, register, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
