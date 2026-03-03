import type { StockMovement, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getStockMovements(
  page = 0,
  size = 50,
  warehouseId?: string,
  partId?: string,
  type?: string,
): Promise<PagedResponse<StockMovement>> {
  let path = `/stock-movements?page=${page}&size=${size}`;
  if (warehouseId) path += `&warehouseId=${warehouseId}`;
  if (partId) path += `&partId=${partId}`;
  if (type) path += `&type=${type}`;
  return serverGet<PagedResponse<StockMovement>>(path);
}

export async function getStockMovementById(
  id: string,
): Promise<StockMovement> {
  return serverGet<StockMovement>(`/stock-movements/${id}`);
}
