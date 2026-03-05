import type {
  PurchaseOrder,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export async function createPurchaseOrder(
  data: CreatePurchaseOrderRequest,
): Promise<PurchaseOrder> {
  return apiPost<PurchaseOrder>("/purchase-orders", data);
}

export async function updatePurchaseOrder(
  id: string,
  data: UpdatePurchaseOrderRequest,
): Promise<PurchaseOrder> {
  return apiPut<PurchaseOrder>(`/purchase-orders/${id}`, data);
}

export async function deletePurchaseOrder(id: string): Promise<void> {
  return apiDelete(`/purchase-orders/${id}`);
}
