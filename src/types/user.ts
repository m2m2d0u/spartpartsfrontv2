export type UserRole = "ADMIN" | "STORE_MANAGER" | "WAREHOUSE_OPERATOR";

export enum Permission {
  // Stock
  STOCK_VIEW = "STOCK_VIEW",
  STOCK_CREATE = "STOCK_CREATE",
  STOCK_UPDATE = "STOCK_UPDATE",
  STOCK_ADJUST = "STOCK_ADJUST",
  STOCK_DELETE = "STOCK_DELETE",
  STOCK_EXPORT = "STOCK_EXPORT",
  // Order
  ORDER_VIEW = "ORDER_VIEW",
  ORDER_CREATE = "ORDER_CREATE",
  ORDER_UPDATE = "ORDER_UPDATE",
  ORDER_DELETE = "ORDER_DELETE",
  ORDER_APPROVE = "ORDER_APPROVE",
  ORDER_FULFILL = "ORDER_FULFILL",
  ORDER_EXPORT = "ORDER_EXPORT",
  // Invoice
  INVOICE_VIEW = "INVOICE_VIEW",
  INVOICE_CREATE = "INVOICE_CREATE",
  INVOICE_UPDATE = "INVOICE_UPDATE",
  INVOICE_DELETE = "INVOICE_DELETE",
  INVOICE_SEND = "INVOICE_SEND",
  INVOICE_PRINT = "INVOICE_PRINT",
  INVOICE_PAYMENT = "INVOICE_PAYMENT",
  INVOICE_EXPORT = "INVOICE_EXPORT",
  // Procurement
  PROCUREMENT_VIEW = "PROCUREMENT_VIEW",
  PROCUREMENT_CREATE = "PROCUREMENT_CREATE",
  PROCUREMENT_UPDATE = "PROCUREMENT_UPDATE",
  PROCUREMENT_DELETE = "PROCUREMENT_DELETE",
  PROCUREMENT_APPROVE = "PROCUREMENT_APPROVE",
  PROCUREMENT_RECEIVE = "PROCUREMENT_RECEIVE",
  PROCUREMENT_EXPORT = "PROCUREMENT_EXPORT",
  // Transfer
  TRANSFER_VIEW = "TRANSFER_VIEW",
  TRANSFER_CREATE = "TRANSFER_CREATE",
  TRANSFER_UPDATE = "TRANSFER_UPDATE",
  TRANSFER_DELETE = "TRANSFER_DELETE",
  TRANSFER_APPROVE = "TRANSFER_APPROVE",
  TRANSFER_SEND = "TRANSFER_SEND",
  TRANSFER_RECEIVE = "TRANSFER_RECEIVE",
  TRANSFER_EXPORT = "TRANSFER_EXPORT",
  // Return
  RETURN_VIEW = "RETURN_VIEW",
  RETURN_CREATE = "RETURN_CREATE",
  RETURN_UPDATE = "RETURN_UPDATE",
  RETURN_DELETE = "RETURN_DELETE",
  RETURN_APPROVE = "RETURN_APPROVE",
  RETURN_REFUND = "RETURN_REFUND",
  RETURN_RESTOCK = "RETURN_RESTOCK",
  RETURN_EXPORT = "RETURN_EXPORT",
  // Report
  REPORT_VIEW = "REPORT_VIEW",
  REPORT_EXPORT = "REPORT_EXPORT",
  REPORT_SALES = "REPORT_SALES",
  REPORT_INVENTORY = "REPORT_INVENTORY",
  REPORT_FINANCIAL = "REPORT_FINANCIAL",
  // Customer
  CUSTOMER_VIEW = "CUSTOMER_VIEW",
  CUSTOMER_CREATE = "CUSTOMER_CREATE",
  CUSTOMER_UPDATE = "CUSTOMER_UPDATE",
  CUSTOMER_DELETE = "CUSTOMER_DELETE",
  CUSTOMER_EXPORT = "CUSTOMER_EXPORT",
  // Part
  PART_VIEW = "PART_VIEW",
  PART_CREATE = "PART_CREATE",
  PART_UPDATE = "PART_UPDATE",
  PART_DELETE = "PART_DELETE",
  PART_EXPORT = "PART_EXPORT",
  PART_IMPORT = "PART_IMPORT",
  PART_PRICING = "PART_PRICING",
  // Settings
  SETTINGS_VIEW = "SETTINGS_VIEW",
  SETTINGS_UPDATE = "SETTINGS_UPDATE",
}

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

/** Permission grouped by category for UI rendering */
export const PERMISSIONS_BY_CATEGORY: Record<
  PermissionCategory,
  Permission[]
> = {
  STOCK: [Permission.STOCK_VIEW, Permission.STOCK_CREATE, Permission.STOCK_UPDATE, Permission.STOCK_ADJUST, Permission.STOCK_DELETE, Permission.STOCK_EXPORT],
  ORDER: [Permission.ORDER_VIEW, Permission.ORDER_CREATE, Permission.ORDER_UPDATE, Permission.ORDER_DELETE, Permission.ORDER_APPROVE, Permission.ORDER_FULFILL, Permission.ORDER_EXPORT],
  INVOICE: [Permission.INVOICE_VIEW, Permission.INVOICE_CREATE, Permission.INVOICE_UPDATE, Permission.INVOICE_DELETE, Permission.INVOICE_SEND, Permission.INVOICE_PRINT, Permission.INVOICE_PAYMENT, Permission.INVOICE_EXPORT],
  PROCUREMENT: [Permission.PROCUREMENT_VIEW, Permission.PROCUREMENT_CREATE, Permission.PROCUREMENT_UPDATE, Permission.PROCUREMENT_DELETE, Permission.PROCUREMENT_APPROVE, Permission.PROCUREMENT_RECEIVE, Permission.PROCUREMENT_EXPORT],
  TRANSFER: [Permission.TRANSFER_VIEW, Permission.TRANSFER_CREATE, Permission.TRANSFER_UPDATE, Permission.TRANSFER_DELETE, Permission.TRANSFER_APPROVE, Permission.TRANSFER_SEND, Permission.TRANSFER_RECEIVE, Permission.TRANSFER_EXPORT],
  RETURN: [Permission.RETURN_VIEW, Permission.RETURN_CREATE, Permission.RETURN_UPDATE, Permission.RETURN_DELETE, Permission.RETURN_APPROVE, Permission.RETURN_REFUND, Permission.RETURN_RESTOCK, Permission.RETURN_EXPORT],
  REPORT: [Permission.REPORT_VIEW, Permission.REPORT_EXPORT, Permission.REPORT_SALES, Permission.REPORT_INVENTORY, Permission.REPORT_FINANCIAL],
  CUSTOMER: [Permission.CUSTOMER_VIEW, Permission.CUSTOMER_CREATE, Permission.CUSTOMER_UPDATE, Permission.CUSTOMER_DELETE, Permission.CUSTOMER_EXPORT],
  PART: [Permission.PART_VIEW, Permission.PART_CREATE, Permission.PART_UPDATE, Permission.PART_DELETE, Permission.PART_EXPORT, Permission.PART_IMPORT, Permission.PART_PRICING],
  SETTINGS: [Permission.SETTINGS_VIEW, Permission.SETTINGS_UPDATE],
};

export type UserWarehouseAssignment = {
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  permissions: Permission[];
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
  permissions: Permission[];
};

/** Mirrors backend UpdateUserStoresRequest */
export type UpdateUserStoresRequest = {
  storeIds: string[];
};
