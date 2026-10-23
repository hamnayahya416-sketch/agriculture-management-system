import { createSelector } from "@reduxjs/toolkit";
import { selectCropItems, selectOrderItems, selectBuyerItems } from "./entitySelectors";

export const selectAllCrops = selectCropItems;

export const selectCropById = (state, cropId) =>
  selectCropItems(state).find((crop) => String(crop.id) === String(cropId)) || null;

const selectOrders = selectOrderItems;
const selectBuyers = selectBuyerItems;

/* Quantity already sold: non-cancelled orders + buyer purchases. */
export const selectSoldQtyByCrop = createSelector(
  [selectOrders, selectBuyers],
  (orders, buyers) => {
    const map = {};
    orders.forEach((order) => {
      if (order.status !== "Cancelled") {
        map[order.cropId] = (map[order.cropId] || 0) + (Number(order.quantity) || 0);
      }
    });
    buyers.forEach((buyer) => {
      map[buyer.cropId] = (map[buyer.cropId] || 0) + (Number(buyer.quantity) || 0);
    });
    return map;
  }
);

/* Every crop with its sold quantity, available stock and remaining %. */
export const selectStockRows = createSelector(
  [selectAllCrops, selectSoldQtyByCrop],
  (crops, soldMap) =>
    crops.map((crop) => {
      const total = Number(crop.harvestQty) || 0;
      const sold = Number(soldMap[crop.id]) || 0;
      const available = Math.max(0, total - sold);
      return {
        ...crop,
        sold,
        available,
        remainingPercent: total > 0 ? Math.round((available / total) * 100) : 0,
      };
    })
);

export const selectAvailableStockById = createSelector(
  [selectStockRows, (_, cropId) => cropId],
  (rows, cropId) => {
    const row = rows.find((entry) => String(entry.id) === String(cropId));
    return row ? row.available : 0;
  }
);

export const selectCropOptions = createSelector([selectStockRows], (rows) =>
  rows.map((row) => ({
    id: row.id,
    name: row.name,
    available: row.available,
    unit: row.unit || "kg",
    price: row.price || 0,
  }))
);

export const selectCropNames = createSelector([selectAllCrops], (crops) => {
  const map = {};
  crops.forEach((crop) => {
    map[crop.id] = crop.name;
  });
  return map;
});

/* Crops by health status — drives the doughnut chart. */
export const selectHealthStatusCounts = createSelector([selectAllCrops], (crops) => {
  const counts = { Healthy: 0, "Needs Attention": 0, Critical: 0 };
  crops.forEach((crop) => {
    const key = counts[crop.status] !== undefined ? crop.status : "Needs Attention";
    counts[key] += 1;
  });
  return Object.keys(counts).map((name) => ({ name, value: counts[name] }));
});

/* Filter (by health / search) + sort (date / quantity / name) live here,
   never inside components. */
export const selectVisibleCrops = createSelector(
  [selectStockRows, (_, view) => view || {}],
  (crops, view) => {
    const health = view.health || "All";
    const query = String(view.query || "").trim().toLowerCase();
    const sort = view.sort || "cuttingDate";

    let rows = crops.filter(
      (crop) => health === "All" || crop.status === health
    );

    if (query) {
      rows = rows.filter((crop) =>
        [crop.name, crop.field, crop.category].some((field) =>
          String(field || "").toLowerCase().includes(query)
        )
      );
    }

    rows = [...rows].sort((a, b) => {
      if (sort === "quantity") {
        return (Number(b.harvestQty) || 0) - (Number(a.harvestQty) || 0);
      }
      if (sort === "name") {
        return String(a.name).localeCompare(String(b.name));
      }
      if (sort === "health") {
        return (Number(b.healthScore) || 0) - (Number(a.healthScore) || 0);
      }
      return String(a.cuttingDate || "").localeCompare(String(b.cuttingDate || ""));
    });

    return rows;
  }
);
