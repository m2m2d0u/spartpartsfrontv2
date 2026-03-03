export type PurchaseOrderStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

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
