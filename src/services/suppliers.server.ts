import type { Supplier, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getSuppliers(
  page = 0,
  size = 50,
): Promise<PagedResponse<Supplier>> {
  return serverGet<PagedResponse<Supplier>>(
    `/suppliers?page=${page}&size=${size}`,
  );
}

export async function getSupplierById(id: string): Promise<Supplier> {
  return serverGet<Supplier>(`/suppliers/${id}`);
}
