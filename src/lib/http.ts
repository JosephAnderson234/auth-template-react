import { env } from "../config/env";
import { sessionStorageService } from "./storage";

export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/** Se dispara cuando el backend responde 401 (token inválido/expirado). */
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

/**
 * Cliente HTTP mínimo basado en fetch.
 * - Prefija VITE_API_URL
 * - Agrega `Authorization: Bearer <token>` automáticamente
 * - Lanza HttpError en respuestas no-OK
 */
export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const token = sessionStorageService.getToken();

  const res = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    const message =
      (data as { message?: string } | null)?.message ?? `Error ${res.status}`;
    throw new HttpError(res.status, message, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => http<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    http<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    http<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    http<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    http<T>(path, { ...opts, method: "DELETE" }),
};
