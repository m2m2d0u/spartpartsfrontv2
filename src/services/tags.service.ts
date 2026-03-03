import type { Tag } from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export type CreateTagRequest = {
  name: string;
};

export type UpdateTagRequest = CreateTagRequest;

export async function createTag(data: CreateTagRequest): Promise<Tag> {
  return apiPost<Tag>("/tags", data);
}

export async function updateTag(
  id: string,
  data: UpdateTagRequest,
): Promise<Tag> {
  return apiPut<Tag>(`/tags/${id}`, data);
}

export async function deleteTag(id: string): Promise<void> {
  return apiDelete(`/tags/${id}`);
}
