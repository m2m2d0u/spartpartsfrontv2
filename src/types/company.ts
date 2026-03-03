/** Mirrors backend CompanySettingsResponse — flat structure */
export type CompanySettings = {
  id: string;
  companyName: string;
  logoUrl: string | null;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId: string;
  ninea: string;
  rccm: string;
  phone: string;
  email: string;
  defaultTaxRate: number;
  proformaPrefix: string;
  invoicePrefix: string;
  depositPrefix: string;
  creditNotePrefix: string;
  orderPrefix: string;
  poPrefix: string;
  transferPrefix: string;
  returnPrefix: string;
  defaultPaymentTerms: number;
  defaultProformaValidity: number;
  defaultInvoiceNotes: string;
  defaultTemplateId: string | null;
  sequentialResetYearly: boolean;
  currencySymbol: string;
  currencyPosition: string;
  currencyDecimals: number;
  defaultWarehouseId: string | null;
  portalWarehouseId: string | null;
  portalEnabled: boolean;
  portalMinOrderAmount: number | null;
  portalShippingFlatRate: number | null;
  portalFreeShippingAbove: number | null;
  portalTermsText: string;
  updatedAt: string;
};

/** Mirrors backend UpdateCompanySettingsRequest */
export type UpdateCompanySettingsRequest = Partial<
  Omit<CompanySettings, "id" | "updatedAt">
>;

/** Mirrors backend TaxRateResponse */
export type TaxRate = {
  id: string;
  label: string;
  rate: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CreateTaxRateRequest */
export type CreateTaxRateRequest = {
  label: string;
  rate: number;
  isDefault?: boolean;
};

/** Mirrors backend UpdateTaxRateRequest */
export type UpdateTaxRateRequest = CreateTaxRateRequest;
