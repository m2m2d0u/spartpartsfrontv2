import type { Warehouse, User, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getWarehouses(
  page = 0,
  size = 50,
  isActive?: boolean,
): Promise<PagedResponse<Warehouse>> {
  let path = `/warehouses?page=${page}&size=${size}`;
  if (isActive !== undefined) path += `&isActive=${isActive}`;
  return serverGet<PagedResponse<Warehouse>>(path);
}

export async function getWarehouseById(id: string): Promise<Warehouse> {
  return serverGet<Warehouse>(`/warehouses/${id}`);
}

export async function getWarehouseUsers(
  warehouseId: string,
): Promise<User[]> {
  return serverGet<User[]>(`/warehouses/${warehouseId}/users`);
}

export async function getWarehousesByStore(
  storeId: string,
): Promise<PagedResponse<Warehouse>> {
  const all = await serverGet<PagedResponse<Warehouse>>(
    `/warehouses?page=0&size=200`,
  );
  const filtered = all.content.filter((w) => w.storeId === storeId);
  return {
    ...all,
    content: filtered,
    totalElements: filtered.length,
  };
}
