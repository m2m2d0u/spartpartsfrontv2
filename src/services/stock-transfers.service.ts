import type {
  StockTransfer,
  CreateStockTransferRequest,
  UpdateStockTransferRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export async function createStockTransfer(
  data: CreateStockTransferRequest,
): Promise<StockTransfer> {
  return apiPost<StockTransfer>("/stock-transfers", data);
}

export async function updateStockTransfer(
  id: string,
  data: UpdateStockTransferRequest,
): Promise<StockTransfer> {
  return apiPut<StockTransfer>(`/stock-transfers/${id}`, data);
}

export async function deleteStockTransfer(id: string): Promise<void> {
  return apiDelete(`/stock-transfers/${id}`);
}
