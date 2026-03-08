import type { PartImage } from "./part";

/** Part as displayed in the public portal catalog */
export type PortalPart = {
  id: string;
  partNumber: string;
  name: string;
  shortDescription: string;
  sellingPrice: number;
  categoryName: string | null;
  carBrandName: string | null;
  carModelName: string | null;
  mainImageUrl: string | null;
  images: PartImage[];
  availableStock: number;
};

/** Detailed part for the portal detail page */
export type PortalPartDetail = {
  id: string;
  partNumber: string;
  name: string;
  shortDescription: string;
  description: string;
  sellingPrice: number;
  categoryName: string | null;
  carBrandName: string | null;
  carModelName: string | null;
  images: PartImage[];
  tags: { id: string; name: string }[];
  availableStock: number;
};

/** Category summary for portal filters */
export type PortalCategory = {
  id: string;
  name: string;
  imageUrl: string | null;
  partCount: number;
};

/** Company settings for portal display */
export type PortalCompanySettings = {
  companyName: string;
  logoUrl: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  currencySymbol: string;
  currencyPosition: string;
  currencyDecimals: number;
  thousandsSeparator: string;
  defaultTaxRate: number | null;
  portalEnabled: boolean | null;
  portalMinOrderAmount: number | null;
  portalShippingFlatRate: number | null;
  portalFreeShippingAbove: number | null;
  portalTermsText: string | null;
};

/** Public order placement request */
export type PortalCreateOrderRequest = {
  customer: {
    name: string;
    email: string;
    phone: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items: {
    partId: string;
    quantity: number;
  }[];
  notes?: string;
};

/** Order confirmation response */
export type PortalOrderConfirmation = {
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: {
    partName: string;
    partNumber: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  customerName: string;
  customerEmail: string;
  createdAt: string;
};
