import { API_BASE_URL } from "./api.config";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

const TOKEN_KEY = "sp_access_token";
const REFRESH_KEY = "sp_refresh_token";

// --- Token storage (client-side only) ---

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  // Sync to cookie for middleware route protection
  document.cookie = `${TOKEN_KEY}=${tokens.accessToken}; path=/; max-age=${tokens.expiresIn}; SameSite=Lax`;
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  // Clear cookie
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// --- API calls ---

export async function login(request: LoginRequest): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Login failed");
  }

  const tokens: AuthTokens = json.data;
  setTokens(tokens);
  return tokens;
}

export async function refreshAccessToken(): Promise<AuthTokens | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      clearTokens();
      return null;
    }

    const tokens: AuthTokens = json.data;
    setTokens(tokens);
    return tokens;
  } catch {
    clearTokens();
    return null;
  }
}

export async function fetchMe(): Promise<MeResponse> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch user profile");
  }
  return json.data;
}

export type MeResponse = {
  id: string;
  name: string;
  email: string;
  roleCode: string;
  roleDisplayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  accessibleStores: MeStore[];
  accessibleWarehouses: MeWarehouse[];
  warehouseAssignments: MeWarehouseAssignment[];
};

export type MeStore = {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  isActive: boolean;
};

export type MeWarehouse = {
  id: string;
  code: string;
  name: string;
  location: string;
  storeId: string;
  storeName: string;
  isActive: boolean;
};

export type MeWarehouseAssignment = {
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  permissions: string[];
};

export function logout(): void {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/auth/sign-in";
  }
}
