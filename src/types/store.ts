import type { Address, Auditable } from "./common";

export type Store = Auditable & {
  id: string;
  name: string;
  code: string;
  address: Address;
  phone: string;
  email: string;
  isActive: boolean;
  warehouseCount: number;
  // Nullable override fields — fall back to CompanySettings when null
  logoUrl: string | null;
  ninea: string | null;
  rccm: string | null;
  taxId: string | null;
  proformaPrefix: string | null;
  invoicePrefix: string | null;
  depositPrefix: string | null;
  creditNotePrefix: string | null;
  orderPrefix: string | null;
  defaultPaymentTerms: number | null;
  defaultProformaValidity: number | null;
  defaultInvoiceTemplate: string | null;
  defaultInvoiceNotes: string | null;
};
