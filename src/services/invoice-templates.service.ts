import type {
  InvoiceTemplate,
  CreateInvoiceTemplateRequest,
  UpdateInvoiceTemplateRequest,
} from "@/types";
import type { ImageResponse } from "@/types/store";
import { apiGet, apiPost, apiPut, apiDelete, apiPostFormData, apiPutFormData } from "./api-client";

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

/** File keys matching backend @RequestPart names */
export type TemplateFiles = {
  logo?: File | null;
  stamp?: File | null;
  headerImage?: File | null;
  footerImage?: File | null;
  signature?: File | null;
  watermark?: File | null;
};

/** Create an invoice template with optional file uploads (multipart) */
export async function createInvoiceTemplateWithFiles(
  data: CreateInvoiceTemplateRequest,
  files: TemplateFiles,
): Promise<InvoiceTemplate> {
  const formData = new FormData();
  formData.append(
    "template",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (files.logo) formData.append("logo", files.logo);
  if (files.stamp) formData.append("stamp", files.stamp);
  if (files.headerImage) formData.append("headerImage", files.headerImage);
  if (files.footerImage) formData.append("footerImage", files.footerImage);
  if (files.signature) formData.append("signature", files.signature);
  if (files.watermark) formData.append("watermark", files.watermark);
  return apiPostFormData<InvoiceTemplate>("/invoice-templates/with-files", formData);
}

/** Update an invoice template with optional file uploads (multipart) */
export async function updateInvoiceTemplateWithFiles(
  id: string,
  data: UpdateInvoiceTemplateRequest,
  files: TemplateFiles,
): Promise<InvoiceTemplate> {
  const formData = new FormData();
  formData.append(
    "template",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  if (files.logo) formData.append("logo", files.logo);
  if (files.stamp) formData.append("stamp", files.stamp);
  if (files.headerImage) formData.append("headerImage", files.headerImage);
  if (files.footerImage) formData.append("footerImage", files.footerImage);
  if (files.signature) formData.append("signature", files.signature);
  if (files.watermark) formData.append("watermark", files.watermark);
  return apiPutFormData<InvoiceTemplate>(`/invoice-templates/${id}/with-files`, formData);
}

/** Get template image as base64 */
export async function getTemplateImage(
  templateId: string,
  imageType: "logo" | "stamp" | "header-image" | "footer-image" | "signature" | "watermark",
): Promise<ImageResponse | null> {
  return apiGet<ImageResponse | null>(`/invoice-templates/${templateId}/${imageType}`);
}
