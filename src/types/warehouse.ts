/** Mirrors backend WarehouseResponse */
export type Warehouse = {
  id: string;
  name: string;
  code: string;
  storeId: string;
  storeName: string;
  location: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  contactPerson: string;
  phone: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CreateWarehouseRequest */
export type CreateWarehouseRequest = {
  name: string;
  code: string;
  storeId: string;
  location?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  contactPerson?: string;
  phone?: string;
  notes?: string;
};

/** Mirrors backend UpdateWarehouseRequest */
export type UpdateWarehouseRequest = CreateWarehouseRequest;

/** Mirrors backend WarehouseStockResponse */
export type WarehouseStock = {
  id: string;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  minStockLevel: number;
};
