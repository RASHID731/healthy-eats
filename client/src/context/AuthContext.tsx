import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { User } from "../types/user";

/**
 * AuthContext
 *
 * Provides authentication state + actions across the app:
 * - `user`: current user or null
 * - `loading`: true while checking session
 * - `login`: authenticate with email/password
 * - `register`: create new account
 * - `logout`: clear session
 */
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- SESSION RESTORE ---------------- */
  // On first load, check if user is already logged in (/auth/me).
  // Sets `user` accordingly, then marks loading as false.
  useEffect(() => {
    api
      .get<User | null>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- AUTH ACTIONS ---------------- */
  async function login(email: string, password: string) {
    const res = await api.post<User>("/auth/login", null, {
      params: { email, password },
    });
    setUser(res.data);
  }

  async function register(email: string, password: string) {
    const res = await api.post<User>("/auth/register", null, {
      params: { email, password },
    });
    setUser(res.data);
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  /* ---------------- PROVIDER ---------------- */
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access AuthContext safely.
 * Throws if used outside of <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
