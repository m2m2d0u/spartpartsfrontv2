import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserWarehouseAssignmentRequest,
  UpdateUserStoresRequest,
} from "@/types";
import { apiPost, apiPut, apiDelete } from "./api-client";

export async function createUser(data: CreateUserRequest): Promise<User> {
  return apiPost<User>("/users", data);
}

export async function updateUser(
  id: string,
  data: UpdateUserRequest,
): Promise<User> {
  return apiPut<User>(`/users/${id}`, data);
}

export async function deleteUser(id: string): Promise<void> {
  return apiDelete(`/users/${id}`);
}

export async function updateUserWarehouses(
  id: string,
  assignments: UserWarehouseAssignmentRequest[],
): Promise<User> {
  return apiPut<User>(`/users/${id}/warehouses`, assignments);
}

export async function updateUserStores(
  id: string,
  data: UpdateUserStoresRequest,
): Promise<User> {
  return apiPut<User>(`/users/${id}/stores`, data);
}
