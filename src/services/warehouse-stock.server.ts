import type { WarehouseStock, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getWarehouseStock(
  warehouseId: string,
  page = 0,
  size = 50,
  partId?: string,
): Promise<PagedResponse<WarehouseStock>> {
  let path = `/warehouse-stock?warehouseId=${warehouseId}&page=${page}&size=${size}`;
  if (partId) path += `&partId=${partId}`;
  return serverGet<PagedResponse<WarehouseStock>>(path);
}

export async function getWarehouseStockById(
  id: string,
): Promise<WarehouseStock> {
  return serverGet<WarehouseStock>(`/warehouse-stock/${id}`);
}
