import type { Role, PagedResponse } from "@/types";
import { serverGet } from "./server-api";

export async function getRoles(
  page = 0,
  size = 50,
): Promise<PagedResponse<Role>> {
  return serverGet<PagedResponse<Role>>(`/roles?page=${page}&size=${size}`);
}

export async function getRoleById(id: string): Promise<Role> {
  return serverGet<Role>(`/roles/${id}`);
}

export async function getActiveRoles(): Promise<Role[]> {
  return serverGet<Role[]>("/roles/active");
}

export async function getSystemRoles(): Promise<Role[]> {
  return serverGet<Role[]>("/roles/system");
}

export async function getCustomRoles(): Promise<Role[]> {
  return serverGet<Role[]>("/roles/custom");
}
