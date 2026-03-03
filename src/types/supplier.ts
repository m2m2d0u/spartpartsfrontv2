import type { Address, Auditable } from "./common";

export type Supplier = Auditable & {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: Address;
  notes: string;
  isActive: boolean;
};
