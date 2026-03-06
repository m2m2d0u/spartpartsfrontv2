/** Mirrors backend StoreResponse */
export type Store = {
  id: string;
  name: string;
  code: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  logoUrl: string | null;
  stampImageUrl: string | null;
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
  defaultTemplateId: string | null;
  defaultInvoiceNotes: string | null;
  defaultWarehouseId: string | null;
  portalWarehouseId: string | null;
  currencySymbol: string | null;
  currencyPosition: string | null;
  currencyDecimals: number | null;
  thousandsSeparator: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CreateStoreRequest */
export type CreateStoreRequest = {
  name: string;
  code: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  stampImageUrl?: string | null;
  ninea?: string | null;
  rccm?: string | null;
  taxId?: string | null;
  proformaPrefix?: string | null;
  invoicePrefix?: string | null;
  depositPrefix?: string | null;
  creditNotePrefix?: string | null;
  orderPrefix?: string | null;
  defaultPaymentTerms?: number | null;
  defaultProformaValidity?: number | null;
  defaultTemplateId?: string | null;
  defaultInvoiceNotes?: string | null;
  defaultWarehouseId?: string | null;
  portalWarehouseId?: string | null;
  currencySymbol?: string | null;
  currencyPosition?: string | null;
  currencyDecimals?: number | null;
  thousandsSeparator?: string | null;
};

/** Mirrors backend UpdateStoreRequest */
export type UpdateStoreRequest = CreateStoreRequest & {
  isActive: boolean;
};

/** Mirrors backend ImageResponse */
export type ImageResponse = {
  url: string;
  base64: string;
};
