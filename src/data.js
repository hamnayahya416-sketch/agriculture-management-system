/* All example data for the app lives in this one file. */

export const crops = [
  { id: 1, name: "Wheat", category: "Cereal", quantity: 18400, unit: "kg", field: "North Field", status: "Harvested", target: 120, produced: 112 },
  { id: 2, name: "Rice", category: "Cereal", quantity: 14200, unit: "kg", field: "East Field", status: "Growing", target: 105, produced: 78 },
  { id: 3, name: "Maize", category: "Cereal", quantity: 9800, unit: "kg", field: "South Field", status: "Harvested", target: 70, produced: 64 },
  { id: 4, name: "Cotton", category: "Fiber", quantity: 6400, unit: "kg", field: "West Field", status: "Ready to harvest", target: 48, produced: 41 },
  { id: 5, name: "Tomato", category: "Vegetable", quantity: 3200, unit: "kg", field: "Greenhouse", status: "Ready to harvest", target: 32, produced: 26 },
  { id: 6, name: "Potato", category: "Vegetable", quantity: 7600, unit: "kg", field: "North Field", status: "Harvested", target: 40, produced: 37 },
  { id: 7, name: "Onion", category: "Vegetable", quantity: 4100, unit: "kg", field: "South Field", status: "Growing", target: 26, produced: 14 },
  { id: 8, name: "Mango", category: "Fruit", quantity: 5200, unit: "kg", field: "Orchard", status: "Harvested", target: 55, produced: 48 },
];

export const productionData = [
  { month: "May", produced: 46, target: 48 },
  { month: "Jun", produced: 58, target: 55 },
  { month: "Jul", produced: 71, target: 66 },
  { month: "Aug", produced: 68, target: 70 },
  { month: "Sep", produced: 62, target: 64 },
  { month: "Oct", produced: 55, target: 58 },
];

export const cropShare = crops.slice(0, 6).map((crop) => ({
  name: crop.name,
  value: crop.quantity,
}));

export const supplies = [
  { id: 1, item: "Urea Fertilizer", category: "Fertilizer", supplier: "AgroChem Ltd.", stock: 1250, min: 400, unit: "kg" },
  { id: 2, item: "DAP Fertilizer", category: "Fertilizer", supplier: "AgroChem Ltd.", stock: 310, min: 350, unit: "kg" },
  { id: 3, item: "Wheat Seed", category: "Seeds", supplier: "National Seeds Co.", stock: 860, min: 300, unit: "kg" },
  { id: 4, item: "Rice Seed", category: "Seeds", supplier: "National Seeds Co.", stock: 240, min: 260, unit: "kg" },
  { id: 5, item: "Drip Irrigation Pipes", category: "Irrigation", supplier: "HydroFlow Systems", stock: 1450, min: 500, unit: "m" },
  { id: 6, item: "Neem Oil Pesticide", category: "Crop Protection", supplier: "BioGrow Inputs", stock: 0, min: 120, unit: "L" },
  { id: 7, item: "Harvest Crates", category: "Packaging", supplier: "PackRight Traders", stock: 640, min: 250, unit: "pcs" },
  { id: 8, item: "Packaging Sacks", category: "Packaging", supplier: "PackRight Traders", stock: 2100, min: 800, unit: "pcs" },
];

export const stockByCategory = [
  { name: "Fertilizer", value: 1560 },
  { name: "Seeds", value: 1100 },
  { name: "Irrigation", value: 1450 },
  { name: "Protection", value: 0 },
  { name: "Packaging", value: 2740 },
];

export const deliveries = [
  { id: "DLV-101", item: "Packaging Sacks", supplier: "PackRight Traders", date: "2026-10-06", status: "Received" },
  { id: "DLV-102", item: "Drip Irrigation Pipes", supplier: "HydroFlow Systems", date: "2026-10-09", status: "Received" },
  { id: "DLV-103", item: "Urea Fertilizer", supplier: "AgroChem Ltd.", date: "2026-10-15", status: "In transit" },
  { id: "DLV-104", item: "Neem Oil Pesticide", supplier: "BioGrow Inputs", date: "2026-10-17", status: "Ordered" },
];

export const orders = [
  { id: "ORD-101", customer: "Green Mart Supermarket", email: "orders@greenmart.com", phone: "+1 555 0142", crop: "Wheat", quantity: 1200, unit: "kg", date: "2026-09-18", delivery: "2026-09-25", address: "12 Market Street, Riverside", total: 504, status: "Delivered" },
  { id: "ORD-102", customer: "Sunrise Bakery Co.", email: "procure@sunrise.com", phone: "+1 555 0177", crop: "Wheat", quantity: 800, unit: "kg", date: "2026-09-21", delivery: "2026-09-29", address: "4 Baker Lane, Hillview", total: 336, status: "Delivered" },
  { id: "ORD-103", customer: "FreshBasket Grocers", email: "buy@freshbasket.io", phone: "+1 555 0199", crop: "Potato", quantity: 600, unit: "kg", date: "2026-10-02", delivery: "2026-10-16", address: "88 Orchard Road, Lakeside", total: 330, status: "Processing" },
  { id: "ORD-104", customer: "Royal Restaurant Group", email: "kitchen@royalrest.com", phone: "+1 555 0121", crop: "Tomato", quantity: 250, unit: "kg", date: "2026-10-05", delivery: "2026-10-15", address: "3 Gourmet Avenue, Downtown", total: 225, status: "Packed" },
  { id: "ORD-105", customer: "AgriExport Traders", email: "trade@agriexport.com", phone: "+1 555 0165", crop: "Rice", quantity: 2400, unit: "kg", date: "2026-10-07", delivery: "2026-10-20", address: "Port Terminal 4, Harbour City", total: 1560, status: "Processing" },
  { id: "ORD-106", customer: "City Veggie Market", email: "hello@cityveggie.com", phone: "+1 555 0138", crop: "Onion", quantity: 400, unit: "kg", date: "2026-10-09", delivery: "2026-10-18", address: "21 Grove Street, Midtown", total: 280, status: "Pending" },
  { id: "ORD-107", customer: "Golden Foods Ltd.", email: "supply@goldenfoods.co", phone: "+1 555 0188", crop: "Maize", quantity: 1500, unit: "kg", date: "2026-09-12", delivery: "2026-09-24", address: "7 Grain Way, Mill District", total: 570, status: "Delivered" },
  { id: "ORD-108", customer: "Healthy Bites Cafe", email: "manager@healthybites.com", phone: "+1 555 0154", crop: "Potato", quantity: 200, unit: "kg", date: "2026-10-11", delivery: "2026-10-17", address: "5 Wellness Plaza, Greenpark", total: 110, status: "Packed" },
];

export const weather = {
  place: "Green Valley Farms",
  current: { temp: 27, feels: 28, condition: "Partly cloudy", humidity: 56, wind: 13 },
  forecast: buildForecast(),
};

function buildForecast() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const samples = [
    { condition: "Sunny", high: 30, low: 18, rain: 5 },
    { condition: "Cloudy", high: 28, low: 17, rain: 20 },
    { condition: "Light rain", high: 24, low: 16, rain: 70 },
  ];
  return samples.map((sample, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return {
      ...sample,
      day: days[date.getDay()],
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });
}

/* Recent activity feed, built from real orders + deliveries. */
export function recentActivity(orders, limit = 6) {
  const fromOrders = orders.map((order) => ({
    key: order.id,
    title: `${order.customer} - ${order.crop}`,
    sub: `${order.id} - ${order.status}`,
    date: order.date,
    status: order.status,
  }));

  const fromDeliveries = deliveries.map((delivery) => ({
    key: delivery.id,
    title: delivery.item,
    sub: `${delivery.id} - ${delivery.status}`,
    date: delivery.date,
    status: delivery.status,
  }));

  return [...fromOrders, ...fromDeliveries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
