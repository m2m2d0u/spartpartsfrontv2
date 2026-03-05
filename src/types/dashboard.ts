export type DashboardData = {
  roleLevel: "SYSTEM" | "STORE" | "WAREHOUSE";

  // KPI cards
  totalParts?: number;
  totalStockValue?: number;
  pendingOrdersCount?: number;
  monthlyRevenue?: number;
  lowStockCount?: number;
  warehouseCount?: number;
  storeCount?: number;
  todayMovementsCount?: number;
  pendingTransfersCount?: number;
  overdueInvoicesCount?: number;
  unpaidInvoicesCount?: number;

  // Charts
  revenueChart?: TimeSeriesPoint[];
  movementsChart?: TimeSeriesPoint[];
  ordersByStatus?: Record<string, number>;
  stockByWarehouse?: NamedValue[];

  // Tables
  lowStockItems?: LowStockRow[];
  topSellingParts?: TopPartRow[];
  recentOrders?: RecentOrderRow[];
  recentMovements?: RecentMovementRow[];
};

export type TimeSeriesPoint = {
  date: string;
  value: number;
};

export type NamedValue = {
  name: string;
  value: number;
};

export type LowStockRow = {
  partId: string;
  partNumber: string;
  partName: string;
  warehouseName: string;
  currentStock: number;
  minStockLevel: number;
};

export type TopPartRow = {
  partId: string;
  partNumber: string;
  partName: string;
  quantitySold: number;
  revenue: number;
};

export type RecentOrderRow = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  status: string;
  totalAmount: number;
  orderDate: string;
};

export type RecentMovementRow = {
  movementId: string;
  partName: string;
  warehouseName: string;
  type: string;
  quantityChange: number;
  createdAt: string;
};
