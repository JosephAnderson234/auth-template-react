import { env } from "../config/env";
import type { AuthSession } from "../features/auth/types/auth.types";

/** Guarda la sesión ({ token, user }) en localStorage. */
export const sessionStorageService = {
  get(): AuthSession | null {
    const raw = localStorage.getItem(env.storageKey);
    return raw ? JSON.parse(raw) : null;
  },
  set(session: AuthSession) {
    localStorage.setItem(env.storageKey, JSON.stringify(session));
  },
  clear() {
    localStorage.removeItem(env.storageKey);
  },
  getToken() {
    return this.get()?.token ?? null;
  },
};
