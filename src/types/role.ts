export type Role = {
  id: string;
  code: string;
  displayName: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: PermissionInfo[];
  permissionCount: number;
};

export type PermissionInfo = {
  id: string;
  code: string;
  displayName: string;
  description: string;
  category: string;
  categoryDisplayName: string;
  level: string;
  levelDisplayName: string;
  isActive: boolean;
  isLegacy: boolean;
  isReadOnly: boolean;
};

export type PermissionCategoryGroup = {
  code: string;
  displayName: string;
  description: string;
  permissions: PermissionInfo[];
  count: number;
};

export type PermissionsResponse = {
  categories: PermissionCategoryGroup[];
  allPermissions: PermissionInfo[];
  totalPermissions: number;
  activePermissions: number;
  legacyPermissions: number;
};

export type CreateRoleRequest = {
  code: string;
  displayName: string;
  description?: string;
  permissionIds?: string[];
};

export type UpdateRoleRequest = {
  displayName: string;
  description?: string;
  isActive?: boolean;
};

export type AssignPermissionsToRoleRequest = {
  permissionIds: string[];
};

export type AssignRolesToUserWarehouseRequest = {
  warehouseId: string;
  roleIds: string[];
};
