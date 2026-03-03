type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

export function getInvoiceStatusVariant(
  status: string,
): BadgeVariant {
  switch (status) {
    case "paid":
      return "success";
    case "sent":
    case "partially_paid":
      return "info";
    case "overdue":
      return "error";
    case "draft":
      return "neutral";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}

export function getOrderStatusVariant(
  status: string,
): BadgeVariant {
  switch (status) {
    case "completed":
    case "delivered":
      return "success";
    case "confirmed":
    case "processing":
    case "shipped":
      return "info";
    case "pending":
      return "warning";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}

export function getStoreStatusVariant(
  isActive: boolean,
): BadgeVariant {
  return isActive ? "success" : "neutral";
}

export function getWarehouseStatusVariant(
  isActive: boolean,
): BadgeVariant {
  return isActive ? "success" : "neutral";
}

export function getPurchaseOrderStatusVariant(
  status: string,
): BadgeVariant {
  switch (status) {
    case "received":
      return "success";
    case "sent":
    case "partially_received":
      return "info";
    case "draft":
      return "neutral";
    case "cancelled":
      return "error";
    default:
      return "neutral";
  }
}

export function getReturnStatusVariant(
  status: string,
): BadgeVariant {
  switch (status) {
    case "refunded":
      return "success";
    case "approved":
    case "received":
      return "info";
    case "pending":
      return "warning";
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
}

export function getStockTransferStatusVariant(
  status: string,
): BadgeVariant {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "IN_TRANSIT":
      return "info";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "error";
    default:
      return "neutral";
  }
}

export function getStockMovementTypeVariant(
  type: string,
): BadgeVariant {
  switch (type) {
    case "PURCHASE":
    case "TRANSFER_IN":
    case "RETURN":
      return "success";
    case "SALE":
    case "TRANSFER_OUT":
    case "CLIENT_ORDER":
      return "error";
    case "ADJUSTMENT":
    case "ORDER_CANCELLATION":
    case "INVOICE_CANCELLATION":
      return "warning";
    case "INITIAL":
      return "info";
    default:
      return "neutral";
  }
}
