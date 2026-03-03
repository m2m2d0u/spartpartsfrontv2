import type { Tag, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getTags(
  page = 0,
  size = 50,
): Promise<PagedResponse<Tag>> {
  return serverGet<PagedResponse<Tag>>(`/tags?page=${page}&size=${size}`);
}

export async function getTagById(id: string): Promise<Tag> {
  return serverGet<Tag>(`/tags/${id}`);
}
