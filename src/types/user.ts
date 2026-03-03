export type UserRole = "ADMIN" | "STORE_MANAGER" | "WAREHOUSE_OPERATOR";

export type PermissionCategory =
  | "STOCK"
  | "ORDER"
  | "INVOICE"
  | "PROCUREMENT"
  | "TRANSFER"
  | "RETURN"
  | "REPORT"
  | "CUSTOMER"
  | "PART"
  | "SETTINGS";

export type WarehousePermission =
  // Stock
  | "STOCK_VIEW"
  | "STOCK_CREATE"
  | "STOCK_UPDATE"
  | "STOCK_ADJUST"
  | "STOCK_DELETE"
  | "STOCK_EXPORT"
  // Order
  | "ORDER_VIEW"
  | "ORDER_CREATE"
  | "ORDER_UPDATE"
  | "ORDER_DELETE"
  | "ORDER_APPROVE"
  | "ORDER_FULFILL"
  | "ORDER_EXPORT"
  // Invoice
  | "INVOICE_VIEW"
  | "INVOICE_CREATE"
  | "INVOICE_UPDATE"
  | "INVOICE_DELETE"
  | "INVOICE_SEND"
  | "INVOICE_PRINT"
  | "INVOICE_PAYMENT"
  | "INVOICE_EXPORT"
  // Procurement
  | "PROCUREMENT_VIEW"
  | "PROCUREMENT_CREATE"
  | "PROCUREMENT_UPDATE"
  | "PROCUREMENT_DELETE"
  | "PROCUREMENT_APPROVE"
  | "PROCUREMENT_RECEIVE"
  | "PROCUREMENT_EXPORT"
  // Transfer
  | "TRANSFER_VIEW"
  | "TRANSFER_CREATE"
  | "TRANSFER_UPDATE"
  | "TRANSFER_DELETE"
  | "TRANSFER_APPROVE"
  | "TRANSFER_SEND"
  | "TRANSFER_RECEIVE"
  | "TRANSFER_EXPORT"
  // Return
  | "RETURN_VIEW"
  | "RETURN_CREATE"
  | "RETURN_UPDATE"
  | "RETURN_DELETE"
  | "RETURN_APPROVE"
  | "RETURN_REFUND"
  | "RETURN_RESTOCK"
  | "RETURN_EXPORT"
  // Report
  | "REPORT_VIEW"
  | "REPORT_EXPORT"
  | "REPORT_SALES"
  | "REPORT_INVENTORY"
  | "REPORT_FINANCIAL"
  // Customer
  | "CUSTOMER_VIEW"
  | "CUSTOMER_CREATE"
  | "CUSTOMER_UPDATE"
  | "CUSTOMER_DELETE"
  | "CUSTOMER_EXPORT"
  // Part
  | "PART_VIEW"
  | "PART_CREATE"
  | "PART_UPDATE"
  | "PART_DELETE"
  | "PART_EXPORT"
  | "PART_IMPORT"
  | "PART_PRICING"
  // Settings
  | "SETTINGS_VIEW"
  | "SETTINGS_UPDATE";

/** Permission grouped by category for UI rendering */
export const PERMISSIONS_BY_CATEGORY: Record<
  PermissionCategory,
  WarehousePermission[]
> = {
  STOCK: ["STOCK_VIEW", "STOCK_CREATE", "STOCK_UPDATE", "STOCK_ADJUST", "STOCK_DELETE", "STOCK_EXPORT"],
  ORDER: ["ORDER_VIEW", "ORDER_CREATE", "ORDER_UPDATE", "ORDER_DELETE", "ORDER_APPROVE", "ORDER_FULFILL", "ORDER_EXPORT"],
  INVOICE: ["INVOICE_VIEW", "INVOICE_CREATE", "INVOICE_UPDATE", "INVOICE_DELETE", "INVOICE_SEND", "INVOICE_PRINT", "INVOICE_PAYMENT", "INVOICE_EXPORT"],
  PROCUREMENT: ["PROCUREMENT_VIEW", "PROCUREMENT_CREATE", "PROCUREMENT_UPDATE", "PROCUREMENT_DELETE", "PROCUREMENT_APPROVE", "PROCUREMENT_RECEIVE", "PROCUREMENT_EXPORT"],
  TRANSFER: ["TRANSFER_VIEW", "TRANSFER_CREATE", "TRANSFER_UPDATE", "TRANSFER_DELETE", "TRANSFER_APPROVE", "TRANSFER_SEND", "TRANSFER_RECEIVE", "TRANSFER_EXPORT"],
  RETURN: ["RETURN_VIEW", "RETURN_CREATE", "RETURN_UPDATE", "RETURN_DELETE", "RETURN_APPROVE", "RETURN_REFUND", "RETURN_RESTOCK", "RETURN_EXPORT"],
  REPORT: ["REPORT_VIEW", "REPORT_EXPORT", "REPORT_SALES", "REPORT_INVENTORY", "REPORT_FINANCIAL"],
  CUSTOMER: ["CUSTOMER_VIEW", "CUSTOMER_CREATE", "CUSTOMER_UPDATE", "CUSTOMER_DELETE", "CUSTOMER_EXPORT"],
  PART: ["PART_VIEW", "PART_CREATE", "PART_UPDATE", "PART_DELETE", "PART_EXPORT", "PART_IMPORT", "PART_PRICING"],
  SETTINGS: ["SETTINGS_VIEW", "SETTINGS_UPDATE"],
};

export type UserWarehouseAssignment = {
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  permissions: WarehousePermission[];
};

/** Mirrors backend UserStoreResponse */
export type UserStoreAssignment = {
  id: string;
  storeId: string;
  storeName: string;
  storeCode: string;
  createdAt: string;
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
  stores: UserStoreAssignment[];
  warehouseAssignments: UserWarehouseAssignment[];
};

/** Mirrors backend CreateUserRequest */
export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

/** Mirrors backend UpdateUserRequest */
export type UpdateUserRequest = {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

/** Mirrors backend UserWarehouseAssignmentRequest */
export type UserWarehouseAssignmentRequest = {
  warehouseId: string;
  permissions: WarehousePermission[];
};

/** Mirrors backend UpdateUserStoresRequest */
export type UpdateUserStoresRequest = {
  storeIds: string[];
};
