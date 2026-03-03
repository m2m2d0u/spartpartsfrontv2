import type { StockTransfer, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getStockTransfers(
  page = 0,
  size = 50,
  status?: string,
): Promise<PagedResponse<StockTransfer>> {
  let path = `/stock-transfers?page=${page}&size=${size}`;
  if (status) path += `&status=${status}`;
  return serverGet<PagedResponse<StockTransfer>>(path);
}

export async function getStockTransferById(
  id: string,
): Promise<StockTransfer> {
  return serverGet<StockTransfer>(`/stock-transfers/${id}`);
}
