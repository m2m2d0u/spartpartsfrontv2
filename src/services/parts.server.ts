import type { Part, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getParts(
  page = 0,
  size = 50,
  categoryId?: string,
  published?: boolean,
): Promise<PagedResponse<Part>> {
  let path = `/parts?page=${page}&size=${size}`;
  if (categoryId) path += `&categoryId=${categoryId}`;
  if (published !== undefined) path += `&published=${published}`;
  return serverGet<PagedResponse<Part>>(path);
}

export async function getPartById(id: string): Promise<Part> {
  return serverGet<Part>(`/parts/${id}`);
}
