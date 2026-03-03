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
  getAccessToken,
  type LoginRequest,
} from "@/services/auth.service";

type AuthUser = {
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

/** Decode the payload of a JWT without verifying the signature. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function userFromToken(token: string | null): AuthUser | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.sub !== "string") return null;
  return { email: payload.sub };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(() => {
    const token = getAccessToken();
    setUser(userFromToken(token));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (request: LoginRequest) => {
      await authLogin(request);
      loadUser();
    },
    [loadUser],
  );

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: checkAuth(),
        login,
        logout,
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
