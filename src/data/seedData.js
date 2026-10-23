import { dayOffsetIso, monthOffsetIso, todayIso } from "../utils/formatters";

/* Demo data used on first load (and whenever localStorage is empty/corrupt). */

function avatarUrl(initials, color) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<rect width="128" height="128" rx="64" fill="${color}"/>` +
    `<text x="64" y="64" font-family="Inter, Arial, sans-serif" font-size="46" font-weight="700" ` +
    `fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`;
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (err) {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
}

export const SEED_CROPS = [
  { id: 1, name: "Wheat", field: "North Field", category: "Cereal", healthScore: 92, status: "Healthy", cuttingDate: dayOffsetIso(6), harvestQty: 18400, unit: "kg", price: 0.45, target: 120, produced: 112 },
  { id: 2, name: "Rice", field: "East Field", category: "Cereal", healthScore: 64, status: "Needs Attention", cuttingDate: dayOffsetIso(2), harvestQty: 14200, unit: "kg", price: 0.65, target: 105, produced: 78 },
  { id: 3, name: "Maize", field: "South Field", category: "Cereal", healthScore: 88, status: "Healthy", cuttingDate: dayOffsetIso(-2), harvestQty: 9800, unit: "kg", price: 0.38, target: 70, produced: 64 },
  { id: 4, name: "Cotton", field: "West Field", category: "Fiber", healthScore: 45, status: "Critical", cuttingDate: dayOffsetIso(1), harvestQty: 6400, unit: "kg", price: 1.1, target: 48, produced: 41 },
  { id: 5, name: "Tomato", field: "Greenhouse", category: "Vegetable", healthScore: 71, status: "Needs Attention", cuttingDate: dayOffsetIso(12), harvestQty: 3200, unit: "kg", price: 0.9, target: 32, produced: 26 },
  { id: 6, name: "Potato", field: "North Field", category: "Vegetable", healthScore: 95, status: "Healthy", cuttingDate: dayOffsetIso(20), harvestQty: 7600, unit: "kg", price: 0.55, target: 40, produced: 37 },
  { id: 7, name: "Onion", field: "South Field", category: "Vegetable", healthScore: 86, status: "Healthy", cuttingDate: dayOffsetIso(9), harvestQty: 4100, unit: "kg", price: 0.7, target: 26, produced: 14 },
  { id: 8, name: "Mango", field: "Orchard", category: "Fruit", healthScore: 58, status: "Needs Attention", cuttingDate: dayOffsetIso(30), harvestQty: 5200, unit: "kg", price: 1.3, target: 55, produced: 48 },
];

export const SEED_ORDERS = [
  { id: "ORD-101", cropId: 1, customer: "Green Mart Supermarket", email: "orders@greenmart.com", phone: "+1 555 0142", quantity: 1200, unit: "kg", orderDate: monthOffsetIso(-1, 18), delivery: monthOffsetIso(-1, 25), address: "12 Market Street, Riverside", total: 540, status: "Delivered" },
  { id: "ORD-102", cropId: 1, customer: "Sunrise Bakery Co.", email: "procure@sunrise.com", phone: "+1 555 0177", quantity: 800, unit: "kg", orderDate: monthOffsetIso(-1, 21), delivery: monthOffsetIso(-1, 28), address: "4 Baker Lane, Hillview", total: 360, status: "Delivered" },
  { id: "ORD-103", cropId: 6, customer: "FreshBasket Grocers", email: "buy@freshbasket.io", phone: "+1 555 0199", quantity: 600, unit: "kg", orderDate: monthOffsetIso(0, 2), delivery: monthOffsetIso(0, 16), address: "88 Orchard Road, Lakeside", total: 330, status: "Processing" },
  { id: "ORD-104", cropId: 5, customer: "Royal Restaurant Group", email: "kitchen@royalrest.com", phone: "+1 555 0121", quantity: 250, unit: "kg", orderDate: monthOffsetIso(0, 5), delivery: monthOffsetIso(0, 15), address: "3 Gourmet Avenue, Downtown", total: 225, status: "Packed" },
  { id: "ORD-105", cropId: 2, customer: "AgriExport Traders", email: "trade@agriexport.com", phone: "+1 555 0165", quantity: 2400, unit: "kg", orderDate: monthOffsetIso(0, 7), delivery: monthOffsetIso(0, 20), address: "Port Terminal 4, Harbour City", total: 1560, status: "Processing" },
  { id: "ORD-106", cropId: 7, customer: "City Veggie Market", email: "hello@cityveggie.com", phone: "+1 555 0138", quantity: 400, unit: "kg", orderDate: monthOffsetIso(0, 9), delivery: monthOffsetIso(0, 18), address: "21 Grove Street, Midtown", total: 280, status: "Pending" },
  { id: "ORD-107", cropId: 3, customer: "Golden Foods Ltd.", email: "supply@goldenfoods.co", phone: "+1 555 0188", quantity: 1500, unit: "kg", orderDate: monthOffsetIso(-1, 12), delivery: monthOffsetIso(-1, 24), address: "7 Grain Way, Mill District", total: 570, status: "Delivered" },
  { id: "ORD-108", cropId: 6, customer: "Healthy Bites Cafe", email: "manager@healthybites.com", phone: "+1 555 0154", quantity: 200, unit: "kg", orderDate: monthOffsetIso(0, 11), delivery: monthOffsetIso(0, 17), address: "5 Wellness Plaza, Greenpark", total: 110, status: "Packed" },
];

export const SEED_BUYERS = [
  { id: "BYR-101", name: "Ayesha Khan", cnic: "3520244719832", imageBase64: avatarUrl("AK", "#166534"), cropId: 1, quantity: 500, date: monthOffsetIso(0, 12) },
  { id: "BYR-102", name: "Bilal Ahmed", cnic: "4210198765435", imageBase64: avatarUrl("BA", "#0284c7"), cropId: 3, quantity: 300, date: monthOffsetIso(0, 15) },
  { id: "BYR-103", name: "Sana Iqbal", cnic: "6110155667789", imageBase64: avatarUrl("SI", "#7c3aed"), cropId: 6, quantity: 450, date: dayOffsetIso(-3) },
];

export const SEED_TASKS = [
  { id: "TSK-01", title: "Irrigate North Field drip lines", type: "Irrigation", cropId: 1, dueDate: dayOffsetIso(-2), status: "Pending" },
  { id: "TSK-02", title: "Top-dress rice with urea", type: "Fertilizer", cropId: 2, dueDate: dayOffsetIso(0), status: "Pending" },
  { id: "TSK-03", title: "Spray neem oil on tomato beds", type: "Spraying", cropId: 5, dueDate: dayOffsetIso(2), status: "Pending" },
  { id: "TSK-04", title: "Book harvest labour for maize", type: "Labour", cropId: 3, dueDate: dayOffsetIso(-4), status: "Done" },
  { id: "TSK-05", title: "Weed cotton beds", type: "Labour", cropId: 4, dueDate: dayOffsetIso(4), status: "Pending" },
  { id: "TSK-06", title: "Fertilize onion rows", type: "Fertilizer", cropId: 7, dueDate: dayOffsetIso(-6), status: "Done" },
];

export const SEED_EXPENSES = [
  { id: "EXP-01", cropId: 1, category: "Seeds", amount: 2400, date: monthOffsetIso(-2, 5), note: "Certified wheat seed" },
  { id: "EXP-02", cropId: 1, category: "Fertilizer", amount: 1800, date: monthOffsetIso(-1, 8), note: "Urea top dressing" },
  { id: "EXP-03", cropId: 2, category: "Labour", amount: 3200, date: monthOffsetIso(-1, 14), note: "Transplanting crew" },
  { id: "EXP-04", cropId: 3, category: "Fuel", amount: 950, date: monthOffsetIso(0, 3), note: "Tractor fuel" },
  { id: "EXP-05", cropId: 5, category: "Fertilizer", amount: 1250, date: monthOffsetIso(0, 6), note: "NPK boost spray" },
  { id: "EXP-06", cropId: 4, category: "Seeds", amount: 2100, date: monthOffsetIso(-2, 12), note: "Cotton seed" },
  { id: "EXP-07", cropId: 6, category: "Labour", amount: 1600, date: monthOffsetIso(-1, 22), note: "Harvest support crew" },
  { id: "EXP-08", cropId: 8, category: "Fuel", amount: 700, date: monthOffsetIso(0, 10), note: "Sprayer fuel" },
];

export const SEED_INVENTORY = {
  items: [
    { id: "INV-01", item: "Urea Fertilizer", type: "Fertilizer", qty: 1250, minQty: 400, unit: "kg", supplier: "AgroChem Ltd." },
    { id: "INV-02", item: "DAP Fertilizer", type: "Fertilizer", qty: 310, minQty: 350, unit: "kg", supplier: "AgroChem Ltd." },
    { id: "INV-03", item: "Wheat Seed", type: "Seed", qty: 860, minQty: 300, unit: "kg", supplier: "National Seeds Co." },
    { id: "INV-04", item: "Rice Seed", type: "Seed", qty: 240, minQty: 260, unit: "kg", supplier: "National Seeds Co." },
    { id: "INV-05", item: "Neem Oil Pesticide", type: "Pesticide", qty: 0, minQty: 120, unit: "L", supplier: "BioGrow Inputs" },
    { id: "INV-06", item: "Glyphosate Herbicide", type: "Pesticide", qty: 95, minQty: 60, unit: "L", supplier: "BioGrow Inputs" },
    { id: "INV-07", item: "Maize Seed", type: "Seed", qty: 420, minQty: 200, unit: "kg", supplier: "National Seeds Co." },
    { id: "INV-08", item: "Potash Fertilizer", type: "Fertilizer", qty: 180, minQty: 220, unit: "kg", supplier: "AgroChem Ltd." },
  ],
  usage: [
    { id: "USE-01", itemId: "INV-01", itemName: "Urea Fertilizer", qty: 50, unit: "kg", date: monthOffsetIso(-1, 8), note: "Wheat top dressing" },
    { id: "USE-02", itemId: "INV-02", itemName: "DAP Fertilizer", qty: 60, unit: "kg", date: monthOffsetIso(0, 3), note: "Maize base dose" },
    { id: "USE-03", itemId: "INV-05", itemName: "Neem Oil Pesticide", qty: 25, unit: "L", date: monthOffsetIso(0, 6), note: "Tomato spray" },
  ],
};

export const SEED_ACTIVITY = [
  { id: "ACT-01", user: "admin", action: "added", entity: "Crop", label: "Wheat", timestamp: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: "ACT-02", user: "admin", action: "added", entity: "Order", label: "ORD-106", timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "ACT-03", user: "manager", action: "added", entity: "Buyer", label: "Sana Iqbal", timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "ACT-04", user: "admin", action: "updated", entity: "Inventory", label: "DAP Fertilizer", timestamp: new Date(Date.now() - 86400000).toISOString() },
];

export const SEED_SESSION = null;

export function buildSeedData() {
  return {
    crops: SEED_CROPS,
    orders: SEED_ORDERS,
    buyers: SEED_BUYERS,
    tasks: SEED_TASKS,
    expenses: SEED_EXPENSES,
    inventory: SEED_INVENTORY,
    activity: SEED_ACTIVITY,
    session: SEED_SESSION,
    ui: { theme: "light", sidebarCollapsed: false },
    seededOn: todayIso(),
  };
}

export default buildSeedData;
