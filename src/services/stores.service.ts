import type {
  Store,
  CreateStoreRequest,
  UpdateStoreRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export async function createStore(data: CreateStoreRequest): Promise<Store> {
  return apiPost<Store>("/stores", data);
}

export async function updateStore(
  id: string,
  data: UpdateStoreRequest,
): Promise<Store> {
  return apiPut<Store>(`/stores/${id}`, data);
}

export async function deleteStore(id: string): Promise<void> {
  return apiDelete(`/stores/${id}`);
}

export async function assignUserToStore(
  storeId: string,
  userId: string,
): Promise<void> {
  return apiPost(`/stores/${storeId}/users/${userId}`);
}

export async function unassignUserFromStore(
  storeId: string,
  userId: string,
): Promise<void> {
  return apiDelete(`/stores/${storeId}/users/${userId}`);
}
