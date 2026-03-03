import type { Address, Auditable } from "./common";

export type Customer = Auditable & {
  id: string;
  storeId: string;
  storeName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: Address;
  notes: string;
  totalOrders: number;
  totalSpent: number;
  isActive: boolean;
};
