import type { Invoice, InvoiceStatus, InvoiceType, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getInvoices(
  page = 0,
  size = 50,
  customerId?: string,
  status?: InvoiceStatus,
  invoiceType?: InvoiceType,
): Promise<PagedResponse<Invoice>> {
  let path = `/invoices?page=${page}&size=${size}`;
  if (customerId) path += `&customerId=${customerId}`;
  if (status) path += `&status=${status}`;
  if (invoiceType) path += `&invoiceType=${invoiceType}`;
  return serverGet<PagedResponse<Invoice>>(path);
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  return serverGet<Invoice>(`/invoices/${id}`);
}
