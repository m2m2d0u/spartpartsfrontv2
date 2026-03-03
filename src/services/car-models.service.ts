import type { CarModel } from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export type CreateCarModelRequest = {
  name: string;
  brandId: string;
  yearFrom?: number;
  yearTo?: number;
};

export type UpdateCarModelRequest = CreateCarModelRequest;

export async function createCarModel(
  data: CreateCarModelRequest,
): Promise<CarModel> {
  return apiPost<CarModel>("/car-models", data);
}

export async function updateCarModel(
  id: string,
  data: UpdateCarModelRequest,
): Promise<CarModel> {
  return apiPut<CarModel>(`/car-models/${id}`, data);
}

export async function deleteCarModel(id: string): Promise<void> {
  return apiDelete(`/car-models/${id}`);
}
