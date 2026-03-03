/** Mirrors backend CustomerResponse */
export type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId: string;
  notes: string;
  portalAccess: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CreateCustomerRequest */
export type CreateCustomerRequest = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  notes?: string;
  portalAccess?: boolean;
};

/** Mirrors backend UpdateCustomerRequest */
export type UpdateCustomerRequest = CreateCustomerRequest;
