import {
  IconBox,
  IconCart,
  IconGrid,
  IconPlusCircle,
} from "./icons";

export const NAV = [
  {
    group: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: IconGrid }],
  },
  {
    group: "Operations",
    items: [
      { id: "supplies", label: "Supplies", icon: IconBox },
      { id: "orders", label: "Orders", icon: IconCart },
    ],
  },
  {
    group: "Actions",
    items: [{ id: "form", label: "New Order", icon: IconPlusCircle }],
  },
];

export const PAGE_META = {
  dashboard: { title: "Dashboard", crumb: "Overview" },
  supplies: { title: "Supplies", crumb: "Operations" },
  orders: { title: "Orders", crumb: "Operations" },
  form: { title: "New Order", crumb: "Actions" },
};

export const PAGE_IDS = Object.keys(PAGE_META);
