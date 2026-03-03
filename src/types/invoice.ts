import type { Auditable } from "./common";

export type InvoiceType =
  | "proforma"
  | "invoice"
  | "deposit"
  | "credit_note";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled";

export type InvoiceItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  lineTotal: number;
};

export type InvoiceTemplate = {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
};

export type Invoice = Auditable & {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  status: InvoiceStatus;
  storeId: string;
  storeName: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  issueDate: string;
  dueDate: string;
  notes: string;
  templateId: string;
};
