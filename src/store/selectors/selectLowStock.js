import { createSelector } from "@reduxjs/toolkit";
import { selectInventoryItems, selectInventoryUsage } from "./entitySelectors";

/* Inventory items at or below their minimum quantity. */
export const selectLowStock = createSelector([selectInventoryItems], (items) =>
  items.filter((item) => (Number(item.qty) || 0) <= (Number(item.minQty) || 0))
);

export const selectLowStockCount = createSelector([selectLowStock], (items) => items.length);

export const selectStockStatus = (item) => {
  const qty = Number(item.qty) || 0;
  const minQty = Number(item.minQty) || 0;
  if (qty === 0) return "Out of stock";
  if (qty <= minQty) return "Low stock";
  return "In stock";
};

export const selectInventoryTypeCounts = createSelector([selectInventoryItems], (items) => {
  const counts = {};
  items.forEach((item) => {
    counts[item.type] = (counts[item.type] || 0) + (Number(item.qty) || 0);
  });
  return Object.keys(counts).map((name) => ({ name, value: counts[name] }));
});

export const selectUsageRows = createSelector([selectInventoryUsage], (usage) => usage);
