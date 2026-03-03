import type {
  WarehouseStock,
  UpdateWarehouseStockRequest,
  AdjustWarehouseStockRequest,
} from "@/types";
import { apiPost, apiPut } from "./api-client";

export async function updateWarehouseStock(
  id: string,
  data: UpdateWarehouseStockRequest,
): Promise<WarehouseStock> {
  return apiPut<WarehouseStock>(`/warehouse-stock/${id}`, data);
}

export async function adjustWarehouseStock(
  data: AdjustWarehouseStockRequest,
): Promise<WarehouseStock> {
  return apiPost<WarehouseStock>("/warehouse-stock/adjust", data);
}
