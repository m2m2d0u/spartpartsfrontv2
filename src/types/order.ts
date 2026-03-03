import type { Address, Auditable } from "./common";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export type OrderItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type ClientOrder = Auditable & {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  storeId: string;
  storeName: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  shippingCost: number;
  total: number;
  shippingAddress: Address;
  trackingNumber: string | null;
  orderDate: string;
  notes: string;
};
