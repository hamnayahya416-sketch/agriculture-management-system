import {
  IconBox,
  IconCalendarCheck,
  IconCart,
  IconClock,
  IconGrid,
  IconLayers,
  IconRefresh,
  IconSprout,
  IconTrend,
  IconTruck,
  IconUsers,
} from "./components/common/icons.js";

export const NAV = [
  {
    group: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: IconGrid }],
  },
  {
    group: "Farm Operations",
    items: [
      { to: "/crops", label: "Crops", icon: IconSprout },
      { to: "/harvest-orders", label: "Harvest and Orders", icon: IconCart },
      { to: "/buyers", label: "Buyers", icon: IconUsers },
      { to: "/tasks", label: "Tasks", icon: IconClock },
      { to: "/workers", label: "Workers", icon: IconUsers },
      { to: "/attendance", label: "Attendance", icon: IconCalendarCheck },
    ],
  },
  {
    group: "Resources",
    items: [
      { to: "/expenses", label: "Expenses", icon: IconTrend },
      { to: "/inventory", label: "Inventory", icon: IconBox },
      { to: "/equipment", label: "Equipment", icon: IconTruck },
      { to: "/maintenance", label: "Maintenance", icon: IconRefresh },
      { to: "/reports", label: "Reports", icon: IconLayers },
    ],
  },
];

export const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/crops": "Crops",
  "/harvest-orders": "Harvest and Orders",
  "/buyers": "Buyers",
  "/tasks": "Tasks",
  "/workers": "Workers",
  "/attendance": "Attendance",
  "/expenses": "Expenses",
  "/inventory": "Inventory",
  "/equipment": "Equipment",
  "/maintenance": "Maintenance",
  "/reports": "Reports",
  "/login": "Login",
};

export function pageTitleFor(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES).find((path) => pathname.startsWith(`${path}/`));
  return match ? PAGE_TITLES[match] : "Page not found";
}
