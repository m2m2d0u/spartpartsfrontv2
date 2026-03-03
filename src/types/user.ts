export type UserRole = "ADMIN" | "STORE_MANAGER" | "WAREHOUSE_OPERATOR";

export type WarehousePermission =
  | "STOCK_MANAGE"
  | "ORDER_MANAGE"
  | "INVOICE_MANAGE"
  | "PROCUREMENT_MANAGE"
  | "TRANSFER_MANAGE"
  | "RETURN_MANAGE";

export type UserWarehouseAssignment = {
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  permissions: WarehousePermission[];
};

/** Mirrors backend UserResponse */
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  warehouseAssignments: UserWarehouseAssignment[];
};
