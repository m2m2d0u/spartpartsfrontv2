export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "RECEIVED"
  | "REFUNDED"
  | "CLOSED"
  | "REJECTED";

export type ReturnReason =
  | "DEFECTIVE"
  | "WRONG_PART"
  | "CHANGED_MIND"
  | "DAMAGED_IN_TRANSIT"
  | "OTHER";

export type RestockAction = "RETURN_TO_STOCK" | "WRITE_OFF";

/** Mirrors backend ReturnItemResponse */
export type ReturnItem = {
  id: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  reason: ReturnReason;
  restockAction: RestockAction | null;
  warehouseId: string | null;
  warehouseName: string | null;
};

/** Mirrors backend ReturnResponse */
export type Return = {
  id: string;
  returnNumber: string;
  invoiceId: string | null;
  orderId: string | null;
  customerId: string;
  customerName: string;
  status: ReturnStatus;
  returnDate: string;
  notes: string;
  items: ReturnItem[];
  createdAt: string;
  updatedAt: string;
};
