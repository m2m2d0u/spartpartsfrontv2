export type InvoiceDesign =
  | "CLASSIC"
  | "MODERN"
  | "ELEGANT"
  | "COMPACT"
  | "PROFESSIONAL";

export enum InvoiceDesignCode {
  CLASSIC = "CLASSIC",
  MODERN = "MODERN",
  ELEGANT = "ELEGANT",
  COMPACT = "COMPACT",
  PROFESSIONAL = "PROFESSIONAL",
}

export type InvoiceType = "PROFORMA" | "STANDARD" | "DEPOSIT";

export enum InvoiceTypeCode {
  PROFORMA = "PROFORMA",
  STANDARD = "STANDARD",
  DEPOSIT = "DEPOSIT",
}

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PAID"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "CANCELLED"
  | "ACCEPTED"
  | "EXPIRED";

export enum InvoiceStatusCode {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
}

/** Mirrors backend InvoiceItemResponse */
export type InvoiceItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
};

/** Mirrors backend PaymentResponse (nested in invoice) */
export type InvoicePayment = {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  reference: string;
  notes: string;
  createdAt: string;
};

/** Mirrors backend InvoiceResponse */
export type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  customerId: string;
  customerName: string;
  orderId: string | null;
  proformaId: string | null;
  depositId: string | null;
  templateId: string | null;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  depositDeduction: number;
  totalAmount: number;
  issuedDate: string;
  dueDate: string | null;
  validityDate: string | null;
  paidDate: string | null;
  sourceWarehouseId: string | null;
  sourceWarehouseName: string | null;
  issuerName: string;
  issuerNinea: string;
  issuerRccm: string;
  issuerTaxId: string;
  issuerAddress: string;
  notes: string;
  internalNotes: string;
  items: InvoiceItem[];
  payments: InvoicePayment[];
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend InvoiceTemplateResponse */
export type InvoiceTemplate = {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  design: InvoiceDesign;
  headerLayout: string;
  logoUrl: string | null;
  headerImageUrl: string | null;
  footerImageUrl: string | null;
  stampImageUrl: string | null;
  signatureImageUrl: string | null;
  watermarkImageUrl: string | null;
  showNinea: boolean;
  showRccm: boolean;
  showTaxId: boolean;
  showWarehouseAddress: boolean;
  showCustomerTaxId: boolean;
  showPaymentTerms: boolean;
  showDiscountColumn: boolean;
  defaultNotes: string;
  createdAt: string;
  updatedAt: string;
};

// ─── Request Types ───────────────────────────────────────────────

/** Mirrors backend CreateInvoiceTemplateRequest */
export type CreateInvoiceTemplateRequest = {
  name: string;
  description?: string;
  isDefault?: boolean;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  design?: InvoiceDesign;
  headerLayout?: string;
  logoUrl?: string;
  headerImageUrl?: string;
  footerImageUrl?: string;
  stampImageUrl?: string;
  signatureImageUrl?: string;
  watermarkImageUrl?: string;
  showNinea?: boolean;
  showRccm?: boolean;
  showTaxId?: boolean;
  showWarehouseAddress?: boolean;
  showCustomerTaxId?: boolean;
  showPaymentTerms?: boolean;
  showDiscountColumn?: boolean;
  defaultNotes?: string;
};

/** Mirrors backend UpdateInvoiceTemplateRequest */
export type UpdateInvoiceTemplateRequest = CreateInvoiceTemplateRequest;

/** Mirrors backend InvoiceItemRequest */
export type InvoiceItemRequest = {
  partId: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
};

/** Mirrors backend CreateInvoiceRequest */
export type CreateInvoiceRequest = {
  invoiceType: InvoiceType;
  customerId: string;
  orderId?: string;
  proformaId?: string;
  depositId?: string;
  templateId?: string;
  status?: InvoiceStatus;
  issuedDate: string;
  dueDate?: string;
  validityDate?: string;
  sourceWarehouseId?: string;
  notes?: string;
  internalNotes?: string;
  items: InvoiceItemRequest[];
};

/** Mirrors backend UpdateInvoiceRequest */
export type UpdateInvoiceRequest = {
  invoiceType?: InvoiceType;
  orderId?: string;
  proformaId?: string;
  depositId?: string;
  templateId?: string;
  issuedDate?: string;
  dueDate?: string;
  validityDate?: string;
  sourceWarehouseId?: string;
  notes?: string;
  internalNotes?: string;
  items: InvoiceItemRequest[];
};

/** Mirrors backend UpdateInvoiceStatusRequest */
export type UpdateInvoiceStatusRequest = {
  status: InvoiceStatus;
};
