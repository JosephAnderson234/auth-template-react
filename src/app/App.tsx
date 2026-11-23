import { RouterProvider } from "react-router/dom";
import { AuthProvider } from "../features/auth";
import { router } from "../router";

/** Raíz de la app: aquí se apilan los providers globales. */
// plan para poder settear mas contextos gloables
export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
