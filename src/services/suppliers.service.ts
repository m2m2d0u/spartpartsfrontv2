import type {
  Supplier,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export async function createSupplier(
  data: CreateSupplierRequest,
): Promise<Supplier> {
  return apiPost<Supplier>("/suppliers", data);
}

export async function updateSupplier(
  id: string,
  data: UpdateSupplierRequest,
): Promise<Supplier> {
  return apiPut<Supplier>(`/suppliers/${id}`, data);
}

export async function deleteSupplier(id: string): Promise<void> {
  return apiDelete(`/suppliers/${id}`);
}
