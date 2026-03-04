import type { Part, PartImage, CreatePartRequest, UpdatePartRequest } from "@/types";
import { apiPost, apiPostFormData, apiPut, apiDelete } from "./api-client";

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
