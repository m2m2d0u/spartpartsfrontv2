import type {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  UpdateInvoiceStatusRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete, apiGetBlob } from "./api-client";

export async function createInvoice(
  data: CreateInvoiceRequest,
): Promise<Invoice> {
  return apiPost<Invoice>("/invoices", data);
}

export async function updateInvoice(
  id: string,
  data: UpdateInvoiceRequest,
): Promise<Invoice> {
  return apiPut<Invoice>(`/invoices/${id}`, data);
}

export async function updateInvoiceStatus(
  id: string,
  data: UpdateInvoiceStatusRequest,
): Promise<Invoice> {
  return apiPut<Invoice>(`/invoices/${id}/status`, data);
}

export async function deleteInvoice(id: string): Promise<void> {
  return apiDelete(`/invoices/${id}`);
}

/** Returns a blob URL for the invoice PDF (for in-app viewer). */
export async function getInvoicePdfBlobUrl(id: string): Promise<string> {
  const blob = await apiGetBlob(`/invoices/${id}/preview`);
  return URL.createObjectURL(blob);
}

/** Opens the invoice PDF in a new browser tab (inline preview). */
export async function previewInvoicePdf(id: string): Promise<void> {
  const blob = await apiGetBlob(`/invoices/${id}/preview`);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  // Revoke after a short delay to allow the tab to load
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Downloads the invoice PDF as a file. */
export async function downloadInvoicePdf(
  id: string,
  filename?: string,
): Promise<void> {
  const blob = await apiGetBlob(`/invoices/${id}/download`);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "invoice.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
