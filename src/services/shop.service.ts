import type { PagedResponse } from "@/types";
import type {
  PortalPart,
  PortalCreateOrderRequest,
  PortalOrderConfirmation,
} from "@/types/portal";
import { publicGet, publicPost } from "./public-api";

export async function searchShopParts(
  page: number,
  size: number,
  filters?: {
    name?: string;
    categoryId?: string;
    carBrandId?: string;
    carModelId?: string;
  },
): Promise<PagedResponse<PortalPart>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  if (filters?.name) params.set("name", filters.name);
  if (filters?.categoryId) params.set("categoryId", filters.categoryId);
  if (filters?.carBrandId) params.set("carBrandId", filters.carBrandId);
  if (filters?.carModelId) params.set("carModelId", filters.carModelId);

  return publicGet<PagedResponse<PortalPart>>(`/portal/parts?${params}`);
}

export async function getShopCarBrands(): Promise<
  { id: string; name: string }[]
> {
  return publicGet<{ id: string; name: string }[]>("/portal/car-brands");
}

export async function getShopCarModels(
  brandId?: string,
): Promise<{ id: string; name: string; brandId: string }[]> {
  const params = brandId ? `?brandId=${brandId}` : "";
  return publicGet<{ id: string; name: string; brandId: string }[]>(
    `/portal/car-models${params}`,
  );
}

export async function placeOrder(
  data: PortalCreateOrderRequest,
): Promise<PortalOrderConfirmation> {
  return publicPost<PortalOrderConfirmation>("/portal/orders", data);
}
