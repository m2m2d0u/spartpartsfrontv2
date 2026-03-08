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
  totalStock: number;
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
  totalStock: number;
};

/** Category summary for portal filters */
export type PortalCategory = {
  id: string;
  name: string;
  imageUrl: string | null;
  partCount: number;
};

/** Store configuration for portal display */
export type PortalStoreConfig = {
  storeName: string;
  logoUrl: string | null;
  currencySymbol: string;
  currencyPosition: string;
  currencyDecimals: number;
  thousandsSeparator: string;
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
