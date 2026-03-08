import "server-only";

import type { PagedResponse } from "@/types";
import type {
  PortalPart,
  PortalPartDetail,
  PortalCategory,
  PortalCompanySettings,
  PortalOrderConfirmation,
} from "@/types/portal";
import { publicGet } from "./public-api";

export async function getShopParts(
  page = 0,
  size = 20,
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

export async function getShopPartById(
  id: string,
): Promise<PortalPartDetail> {
  return publicGet<PortalPartDetail>(`/portal/parts/${id}`);
}

export async function getShopCategories(): Promise<PortalCategory[]> {
  return publicGet<PortalCategory[]>("/portal/categories");
}

export async function getShopCompanySettings(): Promise<PortalCompanySettings> {
  return publicGet<PortalCompanySettings>("/portal/company-settings");
}

export async function getShopOrder(
  orderNumber: string,
): Promise<PortalOrderConfirmation> {
  return publicGet<PortalOrderConfirmation>(
    `/portal/orders/${orderNumber}`,
  );
}
