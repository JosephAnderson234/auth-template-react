# React Auth Template

Plantilla **React 19 + Vite + TypeScript + React Router** con autenticación (JWT/token),
protección de rutas por sesión y por rol, y un backend simulado para desarrollar sin API.

## Inicio rápido

Funciona igual con **npm** o **pnpm** (los scripts no dependen del gestor).

| Acción            | npm                 | pnpm             |
| ----------------- | ------------------- | ---------------- |
| Instalar          | `npm install`       | `pnpm install`   |
| Desarrollo        | `npm run dev`       | `pnpm dev`       |
| Build             | `npm run build`     | `pnpm build`     |
| Revisar tipos     | `npm run typecheck` | `pnpm typecheck` |
| Lint              | `npm run lint`      | `pnpm lint`      |

```bash
cp .env.example .env   # opcional: sin .env se usa el backend simulado
```

> Usa **un solo** gestor por proyecto. Si cambias a npm, borra `pnpm-lock.yaml` y `node_modules`
> antes de `npm install` (se generará `package-lock.json`). Para pasar a pnpm, borra `package-lock.json`.

### Usuarios de prueba (modo mock)

| Email            | Contraseña | Roles         |
| ---------------- | ---------- | ------------- |
| admin@demo.com   | admin123   | user, admin   |
| user@demo.com    | user123    | user          |

## Estructura

```
src/
├── main.tsx                     # Punto de entrada (monta <App/>)
├── app/
│   └── App.tsx                  # Providers globales + RouterProvider
├── config/
│   └── env.ts                   # Variables de entorno tipadas
├── lib/
│   ├── http.ts                  # request(): fetch con baseURL y Bearer token
│   └── storage.ts               # Persistencia de la sesión (localStorage)
├── features/
│   └── auth/                    # Módulo de autenticación (autocontenido)
│       ├── index.ts             # API pública del módulo
│       ├── types/auth.types.ts  # User, Role, LoginRequest, AuthResponse…
│       ├── services/
│       │   ├── auth.service.ts  # login / register / me (real o mock)
│       │   └── auth.mock.ts     # Backend simulado
│       ├── context/
│       │   ├── auth.context.ts  # createContext
│       │   └── AuthProvider.tsx # Estado: status, user, token, login, register, logout, hasRole
│       ├── hooks/useAuth.ts     # Hook de acceso al contexto
│       └── pages/               # LoginPage, RegisterPage
├── router/
│   ├── paths.ts                 # ⭐ Todas las URLs de la app
│   ├── index.tsx                # Árbol de rutas
│   └── guards/
│       ├── ProtectedRoute.tsx   # Requiere sesión (y opcionalmente rol)
│       └── PublicOnlyRoute.tsx  # Solo invitados (login/register)
├── layouts/                     # MainLayout (navbar), AuthLayout (tarjeta centrada)
├── pages/                       # Páginas generales (Home, Dashboard, Profile, Admin, 403, 404)
└── shared/components/           # Componentes reutilizables (FullPageLoader…)
```

## Flujo de autenticación

1. Al cargar, `AuthProvider` lee la sesión de `localStorage`. Si existe, queda en `status: "checking"`
   y valida el token con `GET /auth/me`.
2. `login` / `register` llaman al servicio, guardan `{ token, user }` y pasan a `"authenticated"`.
3. `request()` de `lib/http.ts` añade `Authorization: Bearer <token>` a cada petición y lanza un
   `Error` con el mensaje del backend si la respuesta falla. Si responde **401** con un token guardado,
   borra la sesión y redirige a `/login`.
4. Los guards leen `status`:
   - `checking` → muestra loader
   - `unauthenticated` → `ProtectedRoute` redirige a `/login` guardando la ruta de origen
   - sin el rol requerido → redirige a `/403`
5. Tras el login se vuelve a la ruta que el usuario intentaba abrir.

## Cómo adaptarla

### Cambiar una URL
Edita `src/router/paths.ts`. Router, guards, navbar y links usan esas constantes.

### Agregar una ruta
1. Añade la URL en `paths.ts`.
2. Crea la página en `src/pages/` (o en `src/features/<modulo>/pages/`).
3. Colócala en el grupo correcto de `src/router/index.tsx`:

```tsx
// Pública
{ path: PATHS.about, element: <AboutPage /> },

// Requiere sesión
{ element: <ProtectedRoute />, children: [
  { path: PATHS.orders, element: <OrdersPage /> },
]},

// Requiere rol
{ element: <ProtectedRoute roles={["admin"]} />, children: [
  { path: PATHS.users, element: <UsersPage /> },
]},
```

### Conectar tu backend
1. En `.env`: `VITE_API_URL=http://localhost:8080/api` y `VITE_USE_MOCK_AUTH=false`.
2. Ajusta los endpoints en `features/auth/services/auth.service.ts` (`ENDPOINTS`).
3. Si tu API responde con otra forma, adapta `AuthResponse` / `User` en `auth.types.ts`
   o mapea la respuesta dentro de `realAuthService`.

### Nuevos roles
Amplía el tipo `Role` en `auth.types.ts`. En componentes: `const { hasRole } = useAuth(); hasRole("admin")`.

### Nuevo módulo (feature)
Copia la forma de `features/auth/`: `types/`, `services/` (usando `request` de `lib/http`), `hooks/`, `pages/`
y un `index.ts` que exporte lo público.

## Notas de seguridad

- El token se guarda en `localStorage` por simplicidad. En producción considera cookies `HttpOnly`
  emitidas por el backend; solo necesitas cambiar `lib/storage.ts` y `lib/http.ts` (`credentials: "include"`).
- La protección de rutas en el frontend es solo UX: **el backend siempre debe validar el token y los roles**.
