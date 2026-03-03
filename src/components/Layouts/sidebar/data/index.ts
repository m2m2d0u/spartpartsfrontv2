import * as Icons from "../icons";
import type { UserRole } from "@/types";

type NavItem = {
  title: string;
  url?: string;
  icon: typeof Icons.HomeIcon;
  items: { title: string; url: string }[];
  /** Roles that can see this item. If omitted, visible to all roles. */
  roles?: UserRole[];
};

type NavSection = {
  label: string;
  items: NavItem[];
  /** Roles that can see this section. If omitted, visible to all roles. */
  roles?: UserRole[];
};

export function getNavData(
  t: (key: string) => string,
  role?: UserRole,
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
          roles: ["ADMIN", "STORE_MANAGER"],
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
          roles: ["ADMIN", "STORE_MANAGER"],
          items: [
            {
              title: t("invoices"),
              url: "/admin/invoices",
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
          roles: ["ADMIN", "STORE_MANAGER"],
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
          roles: ["ADMIN", "STORE_MANAGER"],
          items: [],
        },
        {
          title: t("orders"),
          url: "/admin/orders",
          icon: Icons.ShoppingCartIcon,
          roles: ["ADMIN", "STORE_MANAGER"],
          items: [],
        },
        {
          title: t("stock"),
          icon: Icons.StackIcon,
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
            },
          ],
        },
        {
          title: t("locations"),
          icon: Icons.BuildingIcon,
          roles: ["ADMIN", "STORE_MANAGER"],
          items: [
            {
              title: t("stores"),
              url: "/admin/stores",
            },
            {
              title: t("warehouses"),
              url: "/admin/warehouses",
            },
          ],
        },
      ],
    },
    {
      label: t("configuration"),
      roles: ["ADMIN"],
      items: [
        {
          title: t("settings"),
          url: "/admin/settings",
          icon: Icons.SettingsIcon,
          items: [],
        },
        {
          title: t("users"),
          url: "/admin/users",
          icon: Icons.Authentication,
          items: [],
        },
      ],
    },
  ];

  if (!role) return all;

  return all
    .filter((section) => !section.roles || section.roles.includes(role))
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(role),
      ),
    }))
    .filter((section) => section.items.length > 0);
}
