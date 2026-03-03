import type { CarBrand } from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export type CreateCarBrandRequest = {
  name: string;
  logoUrl?: string;
};

export type UpdateCarBrandRequest = CreateCarBrandRequest;

export async function createCarBrand(
  data: CreateCarBrandRequest,
): Promise<CarBrand> {
  return apiPost<CarBrand>("/car-brands", data);
}

export async function updateCarBrand(
  id: string,
  data: UpdateCarBrandRequest,
): Promise<CarBrand> {
  return apiPut<CarBrand>(`/car-brands/${id}`, data);
}

export async function deleteCarBrand(id: string): Promise<void> {
  return apiDelete(`/car-brands/${id}`);
}
