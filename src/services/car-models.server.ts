import type { CarModel, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getCarModels(
  brandId?: string,
  page = 0,
  size = 50,
): Promise<PagedResponse<CarModel>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (brandId) params.set("brandId", brandId);
  return serverGet<PagedResponse<CarModel>>(`/car-models?${params.toString()}`);
}

export async function getCarModelById(id: string): Promise<CarModel> {
  return serverGet<CarModel>(`/car-models/${id}`);
}

export async function getCarModelsList(brandId?: string): Promise<CarModel[]> {
  const params = brandId ? `?brandId=${brandId}` : "";
  return serverGet<CarModel[]>(`/car-models/list${params}`);
}
