import type { User, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getUsers(
  page = 0,
  size = 50,
  role?: string,
  isActive?: boolean,
): Promise<PagedResponse<User>> {
  let path = `/users?page=${page}&size=${size}`;
  if (role) path += `&role=${role}`;
  if (isActive !== undefined) path += `&isActive=${isActive}`;
  return serverGet<PagedResponse<User>>(path);
}

export async function getUserById(id: string): Promise<User> {
  return serverGet<User>(`/users/${id}`);
}
