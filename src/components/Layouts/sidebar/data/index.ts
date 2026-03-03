import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "SPARE PARTS",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Parts",
        icon: Icons.BoxIcon,
        items: [
          {
            title: "All Parts",
            url: "/admin/parts",
          },
          {
            title: "Categories",
            url: "/admin/parts/categories",
          },
        ],
      },
      {
        title: "Sales",
        icon: Icons.InvoiceIcon,
        items: [
          {
            title: "Invoices",
            url: "/admin/invoices",
          },
          {
            title: "Payments",
            url: "/admin/payments",
          },
          {
            title: "Returns",
            url: "/admin/returns",
          },
        ],
      },
      {
        title: "Procurement",
        icon: Icons.TruckIcon,
        items: [
          {
            title: "Purchase Orders",
            url: "/admin/purchase-orders",
          },
          {
            title: "Suppliers",
            url: "/admin/suppliers",
          },
        ],
      },
      {
        title: "Customers",
        url: "/admin/customers",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: Icons.ShoppingCartIcon,
        items: [],
      },
      {
        title: "Locations",
        icon: Icons.BuildingIcon,
        items: [
          {
            title: "Stores",
            url: "/admin/stores",
          },
          {
            title: "Warehouses",
            url: "/admin/warehouses",
          },
        ],
      },
    ],
  },
  {
    label: "CONFIGURATION",
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Icons.SettingsIcon,
        items: [],
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Icons.Authentication,
        items: [],
      },
    ],
  },
];
