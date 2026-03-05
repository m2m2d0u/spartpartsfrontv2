import * as Icons from "../icons";
import { Permission } from "@/types";

type NavSubItem = {
  title: string;
  url: string;
  /** Permission required to see this sub-item. If omitted, inherits parent visibility. */
  permission?: Permission;
};

type NavItem = {
  title: string;
  url?: string;
  icon: typeof Icons.HomeIcon;
  items: NavSubItem[];
  /** Permission required to see this item. If omitted, no permission check. */
  permission?: Permission;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export function getNavData(
  t: (key: string) => string,
  hasPermission?: (code: Permission) => boolean,
): NavSection[] {
  const all: NavSection[] = [
    {
      label: t("spareParts"),
      items: [
        {
          title: t("dashboard"),
          url: "/admin",
          icon: Icons.HomeIcon,
          items: [],
        },
        {
          title: t("parts"),
          icon: Icons.BoxIcon,
          permission: Permission.PART_VIEW,
          items: [
            {
              title: t("allParts"),
              url: "/admin/parts",
            },
            {
              title: t("categories"),
              url: "/admin/parts/categories",
            },
            {
              title: t("carBrands"),
              url: "/admin/parts/car-brands",
            },
            {
              title: t("carModels"),
              url: "/admin/parts/car-models",
            },
            {
              title: t("tags"),
              url: "/admin/parts/tags",
            },
          ],
        },
        {
          title: t("sales"),
          icon: Icons.InvoiceIcon,
          permission: Permission.INVOICE_VIEW,
          items: [
            {
              title: t("invoices"),
              url: "/admin/invoices",
            },
            {
              title: t("invoiceTemplates"),
              url: "/admin/invoice-templates",
            },
            {
              title: t("payments"),
              url: "/admin/payments",
            },
            {
              title: t("returns"),
              url: "/admin/returns",
            },
          ],
        },
        {
          title: t("procurement"),
          icon: Icons.TruckIcon,
          permission: Permission.PROCUREMENT_VIEW,
          items: [
            {
              title: t("purchaseOrders"),
              url: "/admin/purchase-orders",
            },
            {
              title: t("suppliers"),
              url: "/admin/suppliers",
            },
          ],
        },
        {
          title: t("customers"),
          url: "/admin/customers",
          icon: Icons.User,
          permission: Permission.CUSTOMER_VIEW,
          items: [],
        },
        {
          title: t("orders"),
          url: "/admin/orders",
          icon: Icons.ShoppingCartIcon,
          permission: Permission.ORDER_VIEW,
          items: [],
        },
        {
          title: t("stock"),
          icon: Icons.StackIcon,
          permission: Permission.STOCK_VIEW,
          items: [
            {
              title: t("warehouseStock"),
              url: "/admin/stock/warehouse-stock",
            },
            {
              title: t("stockMovements"),
              url: "/admin/stock/movements",
            },
            {
              title: t("stockTransfers"),
              url: "/admin/stock/transfers",
              permission: Permission.TRANSFER_VIEW,
            },
          ],
        },
        {
          title: t("locations"),
          icon: Icons.BuildingIcon,
          items: [
            {
              title: t("stores"),
              url: "/admin/stores",
              permission: Permission.STORE_CREATE,
            },
            {
              title: t("warehouses"),
              url: "/admin/warehouses",
              permission: Permission.WAREHOUSE_CREATE,
            },
          ],
        },
      ],
    },
    {
      label: t("configuration"),
      items: [
        {
          title: t("settings"),
          url: "/admin/settings",
          icon: Icons.SettingsIcon,
          permission: Permission.SETTINGS_VIEW,
          items: [],
        },
        {
          title: t("users"),
          url: "/admin/users",
          icon: Icons.Authentication,
          permission: Permission.USER_VIEW,
          items: [],
        },
        {
          title: t("roles"),
          url: "/admin/roles",
          icon: Icons.ShieldIcon,
          permission: Permission.ROLE_VIEW,
          items: [],
        },
      ],
    },
  ];

  if (!hasPermission) return all;

  const checkPerm = (code?: Permission) =>
    !code || hasPermission(code);

  const checkSubItem = (sub: NavSubItem) => checkPerm(sub.permission);

  return all
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => checkPerm(item.permission))
        .map((item) => ({
          ...item,
          items: item.items.filter(checkSubItem),
        })),
    }))
    .filter((section) => section.items.length > 0);
}
