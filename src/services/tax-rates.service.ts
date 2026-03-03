import type {
  TaxRate,
  CreateTaxRateRequest,
  UpdateTaxRateRequest,
} from "@/types";
import { apiGet, apiPost, apiPut, apiDelete } from "./api-client";

export async function getTaxRateById(id: string): Promise<TaxRate> {
  return apiGet<TaxRate>(`/tax-rates/${id}`);
}

export async function createTaxRate(
  data: CreateTaxRateRequest,
): Promise<TaxRate> {
  return apiPost<TaxRate>("/tax-rates", data);
}

export async function updateTaxRate(
  id: string,
  data: UpdateTaxRateRequest,
): Promise<TaxRate> {
  return apiPut<TaxRate>(`/tax-rates/${id}`, data);
}

export async function deleteTaxRate(id: string): Promise<void> {
  return apiDelete(`/tax-rates/${id}`);
}
