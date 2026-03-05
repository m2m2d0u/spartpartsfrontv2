import type {
  PurchaseOrder,
  PurchaseOrderStatus,
  PagedResponse,
} from "@/types";
import { serverGet } from "./server-api";

export async function getPurchaseOrders(
  page = 0,
  size = 50,
  supplierId?: string,
  status?: PurchaseOrderStatus,
): Promise<PagedResponse<PurchaseOrder>> {
  let path = `/purchase-orders?page=${page}&size=${size}`;
  if (supplierId) path += `&supplierId=${supplierId}`;
  if (status) path += `&status=${status}`;
  return serverGet<PagedResponse<PurchaseOrder>>(path);
}

export async function getPurchaseOrderById(
  id: string,
): Promise<PurchaseOrder> {
  return serverGet<PurchaseOrder>(`/purchase-orders/${id}`);
}
