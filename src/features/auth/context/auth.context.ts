import { createContext } from "react";
import type { AuthContextValue } from "../types/auth.types";

// Separado del Provider para que Fast Refresh funcione (un archivo = solo componentes).
export const AuthContext = createContext<AuthContextValue | null>(null);
