import type { PermissionsResponse, PermissionCategoryGroup } from "@/types";
import { serverGet } from "./server-api";

export async function getPermissions(): Promise<PermissionsResponse> {
  return serverGet<PermissionsResponse>("/permissions");
}

export async function getPermissionCategories(): Promise<
  PermissionCategoryGroup[]
> {
  return serverGet<PermissionCategoryGroup[]>("/permissions/categories");
}
