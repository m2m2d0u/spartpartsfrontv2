"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  isAuthenticated as checkAuth,
  login as authLogin,
  logout as authLogout,
  fetchMe,
  type LoginRequest,
  type MeResponse,
} from "@/services/auth.service";

type AuthState = {
  user: MeResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const loadUser = useCallback(async () => {
    const hasToken = checkAuth();
    setAuthenticated(hasToken);

    if (!hasToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      // Token exists but /me failed — still authenticated, just no profile
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (request: LoginRequest) => {
      await authLogin(request);
      setAuthenticated(true);
      await loadUser();
    },
    [loadUser],
  );

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setAuthenticated(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      // Silently fail — user stays as-is
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: authenticated,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
