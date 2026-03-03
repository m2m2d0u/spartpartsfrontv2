import type { Category, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getCategories(
  page = 0,
  size = 50,
): Promise<PagedResponse<Category>> {
  return serverGet<PagedResponse<Category>>(
    `/categories?page=${page}&size=${size}`,
  );
}

export async function getCategoryById(id: string): Promise<Category> {
  return serverGet<Category>(`/categories/${id}`);
}
