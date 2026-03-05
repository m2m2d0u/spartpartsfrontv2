import { InvoiceStatusCode } from "@/types";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

export function getRoleTypeVariant(isSystem: boolean): BadgeVariant {
  return isSystem ? "info" : "warning";
}

export function getRoleStatusVariant(isActive: boolean): BadgeVariant {
  return isActive ? "success" : "neutral";
}

export function getInvoiceStatusVariant(
  status: string,
): BadgeVariant {
  switch (status) {
    case InvoiceStatusCode.PAID:
      return "success";
    case InvoiceStatusCode.SENT:
    case InvoiceStatusCode.PARTIALLY_PAID:
    case InvoiceStatusCode.ACCEPTED:
      return "info";
    case InvoiceStatusCode.OVERDUE:
    case InvoiceStatusCode.EXPIRED:
    case InvoiceStatusCode.CANCELLED:
      return "error";
    case InvoiceStatusCode.DRAFT:
      return "neutral";
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
    case "RECEIVED":
      return "success";
    case "SENT":
    case "PARTIALLY_RECEIVED":
      return "info";
    case "DRAFT":
      return "neutral";
    case "CANCELLED":
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

export function getUserStatusVariant(isActive: boolean): BadgeVariant {
  return isActive ? "success" : "neutral";
}

export function getUserRoleVariant(role: string): BadgeVariant {
  switch (role) {
    case "ADMINISTRATEUR":
      return "error";
    case "RESPONSABLE_MAGASIN":
      return "info";
    case "OPERATEUR_ENTREPOT":
    case "RESPONSABLE_ENTREPOT":
      return "warning";
    case "MAGASINIER":
    case "GESTIONNAIRE_COMMANDES":
    case "RESPONSABLE_ACHATS":
      return "success";
    case "COMPTABLE":
      return "info";
    case "OBSERVATEUR_ENTREPOT":
      return "neutral";
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
