import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsToRoleRequest,
  AssignRolesToUserWarehouseRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export async function createRole(data: CreateRoleRequest): Promise<Role> {
  return apiPost<Role>("/roles", data);
}

export async function updateRole(
  id: string,
  data: UpdateRoleRequest,
): Promise<Role> {
  return apiPut<Role>(`/roles/${id}`, data);
}

export async function deleteRole(id: string): Promise<void> {
  return apiDelete(`/roles/${id}`);
}

export async function assignPermissionsToRole(
  id: string,
  data: AssignPermissionsToRoleRequest,
): Promise<Role> {
  return apiPut<Role>(`/roles/${id}/permissions`, data);
}

export async function assignRolesToUserWarehouse(
  userId: string,
  data: AssignRolesToUserWarehouseRequest,
): Promise<void> {
  return apiPut(`/users/${userId}/warehouse-roles`, data);
}
