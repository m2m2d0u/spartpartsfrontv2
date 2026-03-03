import type { Category } from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export type CreateCategoryRequest = {
  name: string;
  description?: string;
  imageUrl?: string;
};

export type UpdateCategoryRequest = CreateCategoryRequest;

export async function createCategory(
  data: CreateCategoryRequest,
): Promise<Category> {
  return apiPost<Category>("/categories", data);
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest,
): Promise<Category> {
  return apiPut<Category>(`/categories/${id}`, data);
}

export async function deleteCategory(id: string): Promise<void> {
  return apiDelete(`/categories/${id}`);
}
