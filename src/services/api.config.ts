export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function mockDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
