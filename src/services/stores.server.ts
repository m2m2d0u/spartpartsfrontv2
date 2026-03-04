import type { Store, User, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getStores(
  page = 0,
  size = 50,
  isActive?: boolean,
): Promise<PagedResponse<Store>> {
  let path = `/stores?page=${page}&size=${size}`;
  if (isActive !== undefined) path += `&isActive=${isActive}`;
  return serverGet<PagedResponse<Store>>(path);
}

export async function getStoreById(id: string): Promise<Store> {
  return serverGet<Store>(`/stores/${id}`);
}

export async function getStoreUsers(storeId: string): Promise<User[]> {
  return serverGet<User[]>(`/stores/${storeId}/users`);
}
