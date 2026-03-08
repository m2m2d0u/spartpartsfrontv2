import type { Part, PartImage, CreatePartRequest, UpdatePartRequest } from "@/types";
import { apiPost, apiPostFormData, apiPut, apiPutFormData, apiDelete, apiGetBlob } from "./api-client";

export async function createPart(data: CreatePartRequest): Promise<Part> {
  return apiPost<Part>("/parts", data);
}

export async function updatePart(
  id: string,
  data: UpdatePartRequest,
): Promise<Part> {
  return apiPut<Part>(`/parts/${id}`, data);
}

export async function deletePart(id: string): Promise<void> {
  return apiDelete(`/parts/${id}`);
}

export async function addPartImage(
  partId: string,
  data: { url: string; sortOrder?: number },
): Promise<PartImage> {
  return apiPost<PartImage>(`/parts/${partId}/images`, data);
}

export async function removePartImage(
  partId: string,
  imageId: string,
): Promise<void> {
  return apiDelete(`/parts/${partId}/images/${imageId}`);
}

/** Upload multiple images for a part */
export async function uploadPartImages(
  partId: string,
  files: File[],
): Promise<PartImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return apiPostFormData<PartImage[]>(`/parts/${partId}/upload-images`, formData);
}

/** Replace all images for a part */
export async function replacePartImages(
  partId: string,
  files: File[],
): Promise<PartImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return apiPutFormData<PartImage[]>(`/parts/${partId}/replace-images`, formData);
}

/** Bulk import parts from an Excel/CSV file */
export type BulkImportResult = {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: { row: number; field: string; message: string }[];
};

export async function bulkImportParts(
  file: File,
): Promise<BulkImportResult> {
  const formData = new FormData();
  formData.append("file", file);
  return apiPostFormData<BulkImportResult>("/parts/bulk-import", formData);
}

/** Downloads the import template Excel file */
export async function downloadImportTemplate(): Promise<void> {
  const blob = await apiGetBlob("/parts/import-template");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "parts_import_template.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
