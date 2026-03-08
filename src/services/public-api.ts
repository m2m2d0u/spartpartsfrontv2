import { API_BASE_URL } from "./api.config";
import type { ApiResponse } from "./api-client";
import { ApiError } from "./api-client";

async function parsePublicResponse<T>(res: Response): Promise<T> {
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

/** Public (unauthenticated) GET request */
export async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return parsePublicResponse<T>(res);
}

/** Public (unauthenticated) POST request */
export async function publicPost<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return parsePublicResponse<T>(res);
}
