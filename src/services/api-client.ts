import { API_BASE_URL } from "./api.config";
import {
  getAccessToken,
  refreshAccessToken,
  clearTokens,
} from "./auth.service";

// --- Backend response wrappers ---

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string> | null;
  timestamp: string;
};

export type PagedResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

// --- Error class ---

export class ApiError extends Error {
  status: number;
  errors: Record<string, string> | null;

  constructor(
    message: string,
    status: number,
    errors: Record<string, string> | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

// --- Core fetch with JWT (client-side) ---

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = (async () => {
    const tokens = await refreshAccessToken();
    isRefreshing = false;
    refreshPromise = null;
    return !!tokens;
  })();
  return refreshPromise;
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    // Let the browser set Content-Type (with boundary) for FormData
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  // If 401, attempt token refresh once
  if (res.status === 401 && token) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      const newToken = getAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    } else {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/sign-in";
      }
    }
  }

  return res;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.message || `Request failed with status ${res.status}`,
      res.status,
      json.errors,
    );
  }

  return json.data;
}

// --- Public API methods (client-side, uses localStorage JWT) ---

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`);
  return parseResponse<T>(res);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseResponse<T>(res);
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseResponse<T>(res);
}

export async function apiDelete<T = void>(path: string): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`, {
    method: "DELETE",
  });
  return parseResponse<T>(res);
}

/** POST multipart/form-data (file uploads) */
export async function apiPostFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
  });
  return parseResponse<T>(res);
}

/** PUT multipart/form-data (file uploads) */
export async function apiPutFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`, {
    method: "PUT",
    body: formData,
  });
  return parseResponse<T>(res);
}

/** Fetch a binary response (PDF, images, etc.) */
export async function apiGetBlob(path: string): Promise<Blob> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new ApiError(
      `Request failed with status ${res.status}`,
      res.status,
    );
  }
  return res.blob();
}

export async function apiPostFormDataBlob(
  path: string,
  formData: FormData,
): Promise<Blob> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new ApiError(
      `Request failed with status ${res.status}`,
      res.status,
    );
  }
  return res.blob();
}
