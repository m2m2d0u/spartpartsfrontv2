import "server-only";

import { cookies } from "next/headers";
import { API_BASE_URL } from "./api.config";
import { type ApiResponse, ApiError } from "./api-client";

/**
 * Server-side GET with automatic JWT from cookie.
 * Only use this in Server Components / server-only code.
 */
export async function serverGet<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sp_access_token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    cache: "no-store",
  });

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
