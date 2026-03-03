import type { CarBrand, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getCarBrands(
  page = 0,
  size = 50,
): Promise<PagedResponse<CarBrand>> {
  return serverGet<PagedResponse<CarBrand>>(
    `/car-brands?page=${page}&size=${size}`,
  );
}

export async function getCarBrandById(id: string): Promise<CarBrand> {
  return serverGet<CarBrand>(`/car-brands/${id}`);
}
