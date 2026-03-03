import type { Auditable } from "./common";

export type ReturnStatus =
  | "pending"
  | "approved"
  | "received"
  | "refunded"
  | "rejected";

export type ReturnReason =
  | "defective"
  | "wrong_item"
  | "damaged"
  | "not_needed"
  | "other";

export type ReturnItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  reason: ReturnReason;
  notes: string;
};

export type Return = Auditable & {
  id: string;
  returnNumber: string;
  status: ReturnStatus;
  storeId: string;
  storeName: string;
  customerId: string;
  customerName: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  orderId: string | null;
  orderNumber: string | null;
  items: ReturnItem[];
  totalRefund: number;
  returnDate: string;
  notes: string;
};
