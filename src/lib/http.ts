import { env } from "../config/env";
import { PATHS } from "../router/paths";
import { sessionStorageService } from "./storage";

/**
 * Hace una petición al backend con el token (si existe) y devuelve el JSON.
 * Si la respuesta no es OK, lanza un Error con el mensaje del backend.
 */
export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = sessionStorageService.getToken();

  const res = await fetch(env.apiUrl + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Token vencido o inválido: cerrar sesión y mandar al login.
  // (Solo si había token, para no recargar la página al fallar el propio login.)
  if (res.status === 401 && token) {
    sessionStorageService.clear();
    window.location.href = PATHS.login;
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? `Error ${res.status}`);
  return data as T;
}
