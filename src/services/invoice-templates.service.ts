import type {
  InvoiceTemplate,
  CreateInvoiceTemplateRequest,
  UpdateInvoiceTemplateRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export async function createInvoiceTemplate(
  data: CreateInvoiceTemplateRequest,
): Promise<InvoiceTemplate> {
  return apiPost<InvoiceTemplate>("/invoice-templates", data);
}

export async function updateInvoiceTemplate(
  id: string,
  data: UpdateInvoiceTemplateRequest,
): Promise<InvoiceTemplate> {
  return apiPut<InvoiceTemplate>(`/invoice-templates/${id}`, data);
}

export async function deleteInvoiceTemplate(id: string): Promise<void> {
  return apiDelete(`/invoice-templates/${id}`);
}
