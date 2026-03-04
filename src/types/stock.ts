/** Stock movement types — mirrors backend StockMovementType enum */
export type StockMovementType =
  | "PURCHASE"
  | "SALE"
  | "ADJUSTMENT"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "RETURN"
  | "CLIENT_ORDER"
  | "ORDER_CANCELLATION"
  | "INVOICE_CANCELLATION"
  | "INITIAL";

/** Mirrors backend StockMovementResponse */
export type StockMovement = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  type: StockMovementType;
  quantityChange: number;
  balanceAfter: number;
  referenceType: string | null;
  referenceId: string | null;
  notes: string | null;
  createdAt: string;
};

/** Stock transfer statuses — mirrors backend StockTransferStatus enum */
export type StockTransferStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

/** Mirrors backend StockTransferItemResponse */
export type StockTransferItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
};

/** Mirrors backend StockTransferResponse */
export type StockTransfer = {
  id: string;
  transferNumber: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  status: StockTransferStatus;
  transferDate: string;
  notes: string | null;
  items: StockTransferItem[];
  createdAt: string;
  updatedAt: string;
};

/** Mirrors backend CreateStockTransferRequest */
export type CreateStockTransferRequest = {
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  transferDate: string;
  notes?: string;
  items: { partId: string; quantity: number }[];
};

/** Mirrors backend UpdateStockTransferRequest */
export type UpdateStockTransferRequest = CreateStockTransferRequest;

/** Mirrors backend UpdateWarehouseStockRequest */
export type UpdateWarehouseStockRequest = {
  quantity: number;
  minStockLevel: number;
};

/** Mirrors backend AdjustWarehouseStockRequest */
export type AdjustWarehouseStockRequest = {
  warehouseId: string;
  partId: string;
  quantity: number;
  minStockLevel?: number;
  notes?: string;
};
