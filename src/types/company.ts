import type { Address, Auditable } from "./common";

export type TaxRate = {
  id: string;
  label: string;
  rate: number;
  isDefault: boolean;
};

export type CurrencySettings = {
  symbol: string;
  position: "before" | "after";
  decimalPlaces: 0 | 2 | 3;
};

export type InvoiceDefaults = {
  proformaPrefix: string;
  invoicePrefix: string;
  depositPrefix: string;
  creditNotePrefix: string;
  orderPrefix: string;
  defaultPaymentTerms: number;
  defaultProformaValidity: number;
  defaultInvoiceNotes: string;
  sequentialReset: "yearly" | "continuous";
  defaultInvoiceTemplate: string;
};

export type ClientPortalSettings = {
  portalEnabled: boolean;
  minimumOrderAmount: number | null;
  shippingOption: "flat_rate" | "free_above_threshold" | "custom";
  shippingFlatRate?: number;
  shippingFreeThreshold?: number;
  termsAndConditions: string;
};

export type CompanySettings = Auditable & {
  id: string;
  businessName: string;
  logoUrl: string | null;
  address: Address;
  phone: string;
  email: string;
  taxId: string;
  ninea: string;
  rccm: string;
  taxRates: TaxRate[];
  currency: CurrencySettings;
  invoiceDefaults: InvoiceDefaults;
  clientPortal: ClientPortalSettings;
};
