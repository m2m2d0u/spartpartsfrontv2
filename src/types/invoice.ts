export type InvoiceType = "PROFORMA" | "STANDARD" | "DEPOSIT";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PAID"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "CANCELLED"
  | "ACCEPTED"
  | "EXPIRED";

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
