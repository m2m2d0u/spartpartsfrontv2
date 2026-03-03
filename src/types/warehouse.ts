import type { Auditable } from "./common";

export type Warehouse = Auditable & {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  code: string;
  city: string;
  address: string;
  contactPerson: string;
  phone: string;
  notes: string;
  isActive: boolean;
};
