import type { Customer, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getCustomers(
  page = 0,
  size = 50,
): Promise<PagedResponse<Customer>> {
  return serverGet<PagedResponse<Customer>>(
    `/customers?page=${page}&size=${size}`,
  );
}

export async function getCustomerById(id: string): Promise<Customer> {
  return serverGet<Customer>(`/customers/${id}`);
}
