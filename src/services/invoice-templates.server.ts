import type { InvoiceTemplate, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getInvoiceTemplates(
  page = 0,
  size = 50,
): Promise<PagedResponse<InvoiceTemplate>> {
  return serverGet<PagedResponse<InvoiceTemplate>>(
    `/invoice-templates?page=${page}&size=${size}`,
  );
}

export async function getInvoiceTemplateById(
  id: string,
): Promise<InvoiceTemplate> {
  return serverGet<InvoiceTemplate>(`/invoice-templates/${id}`);
}
