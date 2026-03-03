export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

/** Mirrors backend OrderItemResponse */
export type OrderItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

/** Mirrors backend ClientOrderResponse */
export type ClientOrder = {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPostal: string;
  shippingCountry: string;
  notes: string;
  trackingNumber: string | null;
  warehouseId: string | null;
  warehouseName: string | null;
  orderDate: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};
