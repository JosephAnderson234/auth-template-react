import { env } from "../config/env";
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

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? `Error ${res.status}`);
  return data as T;
}
