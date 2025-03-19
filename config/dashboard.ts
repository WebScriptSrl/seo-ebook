import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/dashboard/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/dashboard/charts",
        icon: "lineChart",
        title: "Charts",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: "orders",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/products",
        icon: "add",
        title: "Products",
        badge: "products",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/reviews",
        icon: "edit",
        title: "Reviews",
        badge: "reviews",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/dashboard/reviews",
        icon: "post",
        title: "Reviews",
        authorizeOnly: UserRole.USER,
        // disabled: true,
      },
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      {
        href: "#",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/pricing", icon: "logo", title: "Pricing" },
      { href: "/blog", icon: "page", title: "Blog" },
      { href: "/docs", icon: "bookOpen", title: "Docs" },
      { href: "/guides", icon: "help", title: "Guides" },
    ],
  },
];
