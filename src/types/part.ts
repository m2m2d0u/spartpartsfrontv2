import type { Auditable } from "./common";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type PartImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
};

export type WarehouseStock = {
  warehouseId: string;
  warehouseName: string;
  storeId: string;
  storeName: string;
  quantity: number;
  minStock: number;
  status: StockStatus;
};

export type Category = Auditable & {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  partCount: number;
};

export type Part = Auditable & {
  id: string;
  name: string;
  partNumber: string;
  categoryId: string;
  categoryName: string;
  description: string;
  shortDescription: string;
  sellingPrice: number;
  purchasePrice: number;
  minStock: number;
  totalStock: number;
  stockStatus: StockStatus;
  images: PartImage[];
  notes: string;
  isPublished: boolean;
  warehouseStocks: WarehouseStock[];
};
