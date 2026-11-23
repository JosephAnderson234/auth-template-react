/**
 * ÚNICO lugar donde se definen las rutas de la app.
 * Para cambiar una URL, cámbiala aquí y se actualiza en router, guards y links.
 */
export const PATHS = {
  // Públicas
  home: "/",

  // Solo para usuarios NO autenticados
  login: "/login",
  register: "/register",

  // Protegidas (requieren sesión)
  dashboard: "/dashboard",
  profile: "/profile",

  // Protegidas por rol
  admin: "/admin",

  // Varias
  forbidden: "/403",
} as const;

/** A dónde ir después de iniciar sesión si no había una ruta previa. */
export const DEFAULT_PRIVATE_PATH = PATHS.dashboard;

/** A dónde mandar al usuario cuando no tiene sesión. */
export const DEFAULT_PUBLIC_PATH = PATHS.login;
