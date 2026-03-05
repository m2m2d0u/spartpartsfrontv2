/** Mirrors backend SupplierResponse */
export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CreateSupplierRequest */
export type CreateSupplierRequest = {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
};

/** Mirrors backend UpdateSupplierRequest */
export type UpdateSupplierRequest = CreateSupplierRequest;
