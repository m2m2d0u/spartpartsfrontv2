import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export async function createCustomer(
  data: CreateCustomerRequest,
): Promise<Customer> {
  return apiPost<Customer>("/customers", data);
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerRequest,
): Promise<Customer> {
  return apiPut<Customer>(`/customers/${id}`, data);
}

export async function deleteCustomer(id: string): Promise<void> {
  return apiDelete(`/customers/${id}`);
}
