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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CreateStoreRequest */
export type CreateStoreRequest = {
  name: string;
  code: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  ninea?: string;
  rccm?: string;
  taxId?: string;
  proformaPrefix?: string;
  invoicePrefix?: string;
  depositPrefix?: string;
  creditNotePrefix?: string;
  orderPrefix?: string;
  defaultPaymentTerms?: number;
  defaultProformaValidity?: number;
  defaultTemplateId?: string;
  defaultInvoiceNotes?: string;
  defaultWarehouseId?: string;
  portalWarehouseId?: string;
};

/** Mirrors backend UpdateStoreRequest */
export type UpdateStoreRequest = CreateStoreRequest & {
  isActive: boolean;
};
