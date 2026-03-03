import type {
  Warehouse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

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
