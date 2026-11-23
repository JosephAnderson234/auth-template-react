import { env } from "../config/env";
import type { AuthSession } from "../features/auth/types/auth.types";

/** Persistencia de la sesión. Cambia a sessionStorage o cookies si lo prefieres. */
export const sessionStorageService = {
  get(): AuthSession | null {
    try {
      const raw = localStorage.getItem(env.storageKey);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  },
  set(session: AuthSession) {
    localStorage.setItem(env.storageKey, JSON.stringify(session));
  },
  clear() {
    localStorage.removeItem(env.storageKey);
  },
  getToken(): string | null {
    return this.get()?.token ?? null;
  },
};
