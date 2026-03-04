import type {
  Warehouse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  PagedResponse,
} from "@/types";
import { apiGet, apiPost, apiPut, apiDelete } from "./api-client";

export async function createWarehouse(
  data: CreateWarehouseRequest,
): Promise<Warehouse> {
  return apiPost<Warehouse>("/warehouses", data);
}

export async function updateWarehouse(
  id: string,
  data: UpdateWarehouseRequest,
): Promise<Warehouse> {
  return apiPut<Warehouse>(`/warehouses/${id}`, data);
}

export async function deleteWarehouse(id: string): Promise<void> {
  return apiDelete(`/warehouses/${id}`);
}

export async function assignUserToWarehouse(
  warehouseId: string,
  userId: string,
): Promise<void> {
  return apiPost(`/warehouses/${warehouseId}/users/${userId}`);
}

export async function unassignUserFromWarehouse(
  warehouseId: string,
  userId: string,
): Promise<void> {
  return apiDelete(`/warehouses/${warehouseId}/users/${userId}`);
}

export async function searchWarehouses(query: string): Promise<Warehouse[]> {
  const data = await apiGet<PagedResponse<Warehouse>>(
    `/warehouses/search?query=${encodeURIComponent(query)}&page=0&size=20`,
  );
  return data.content;
}
