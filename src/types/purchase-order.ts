import type { Auditable } from "./common";

export type PurchaseOrderStatus =
  | "draft"
  | "sent"
  | "partially_received"
  | "received"
  | "cancelled";

export type PurchaseOrderItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  lineTotal: number;
};

export type PurchaseOrder = Auditable & {
  id: string;
  orderNumber: string;
  status: PurchaseOrderStatus;
  storeId: string;
  storeName: string;
  warehouseId: string;
  warehouseName: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  orderDate: string;
  expectedDate: string;
  receivedDate: string | null;
  notes: string;
};
