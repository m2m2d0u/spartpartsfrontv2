import * as Icons from "../icons";

type NavItem = {
  title: string;
  url?: string;
  icon: typeof Icons.HomeIcon;
  items: { title: string; url: string }[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export function getNavData(t: (key: string) => string): NavSection[] {
  return [
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
          items: [
            {
              title: t("allParts"),
              url: "/admin/parts",
            },
            {
              title: t("categories"),
              url: "/admin/parts/categories",
            },
          ],
        },
        {
          title: t("sales"),
          icon: Icons.InvoiceIcon,
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
          items: [],
        },
        {
          title: t("orders"),
          url: "/admin/orders",
          icon: Icons.ShoppingCartIcon,
          items: [],
        },
        {
          title: t("locations"),
          icon: Icons.BuildingIcon,
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
}
