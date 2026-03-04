import type {
  Store,
  CreateStoreRequest,
  UpdateStoreRequest,
  PagedResponse,
  ImageResponse,
} from "@/types";
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPostFormData,
  apiPutFormData,
} from "./api-client";

export async function createStore(data: CreateStoreRequest): Promise<Store> {
  return apiPost<Store>("/stores", data);
}

export async function updateStore(
  id: string,
  data: UpdateStoreRequest,
): Promise<Store> {
  return apiPut<Store>(`/stores/${id}`, data);
}

/** Create a store with optional logo and stamp files (multipart) */
export async function createStoreWithFiles(
  data: CreateStoreRequest,
  logo?: File | null,
  stamp?: File | null,
): Promise<Store> {
  const formData = new FormData();
  formData.append(
    "store",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (logo) formData.append("logo", logo);
  if (stamp) formData.append("stamp", stamp);
  return apiPostFormData<Store>("/stores/with-files", formData);
}

/** Update a store with optional logo and stamp files (multipart) */
export async function updateStoreWithFiles(
  id: string,
  data: UpdateStoreRequest,
  logo?: File | null,
  stamp?: File | null,
): Promise<Store> {
  const formData = new FormData();
  formData.append(
    "store",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (logo) formData.append("logo", logo);
  if (stamp) formData.append("stamp", stamp);
  return apiPutFormData<Store>(`/stores/${id}/with-files`, formData);
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

export async function searchStores(query: string): Promise<Store[]> {
  const data = await apiGet<PagedResponse<Store>>(
    `/stores?name=${encodeURIComponent(query)}&page=0&size=20`,
  );
  return data.content;
}

/** Get store logo as base64 */
export async function getStoreLogo(
  storeId: string,
): Promise<ImageResponse | null> {
  return apiGet<ImageResponse | null>(`/stores/${storeId}/logo`);
}

/** Get store stamp as base64 */
export async function getStoreStamp(
  storeId: string,
): Promise<ImageResponse | null> {
  return apiGet<ImageResponse | null>(`/stores/${storeId}/stamp`);
}
