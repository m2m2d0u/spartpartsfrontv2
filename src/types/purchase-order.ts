export type PurchaseOrderStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

export enum PurchaseOrderStatusCode {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED",
  RECEIVED = "RECEIVED",
  CANCELLED = "CANCELLED",
}

/** Mirrors backend PurchaseOrderItemResponse */
export type PurchaseOrderItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
};

/** Mirrors backend PurchaseOrderResponse */
export type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate: string | null;
  destinationWarehouseId: string | null;
  destinationWarehouseName: string | null;
  notes: string;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend PurchaseOrderItemRequest */
export type PurchaseOrderItemRequest = {
  partId: string;
  quantity: number;
  unitPrice: number;
};

/** Mirrors backend CreatePurchaseOrderRequest */
export type CreatePurchaseOrderRequest = {
  supplierId: string;
  status?: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate?: string;
  destinationWarehouseId?: string;
  notes?: string;
  items: PurchaseOrderItemRequest[];
};

/** Mirrors backend UpdatePurchaseOrderRequest */
export type UpdatePurchaseOrderRequest = {
  supplierId: string;
  status?: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate?: string;
  destinationWarehouseId?: string;
  notes?: string;
  items: PurchaseOrderItemRequest[];
};
