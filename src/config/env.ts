/**
 * Configuración central leída desde variables de entorno (Vite: prefijo VITE_).
 * Copia `.env.example` a `.env` y ajusta los valores.
 */
export const env = {
  /** URL base del backend. Ej: http://localhost:8080/api */
  apiUrl: import.meta.env.VITE_API_URL ?? "",
  /** Si es true (o no hay apiUrl) se usa un backend simulado en memoria. */
  useMockAuth:
    import.meta.env.VITE_USE_MOCK_AUTH === "true" || !import.meta.env.VITE_API_URL,
  /** Clave con la que se guarda la sesión en localStorage. */
  storageKey: import.meta.env.VITE_AUTH_STORAGE_KEY ?? "app.auth",
} as const;
