import { createSelector } from "@reduxjs/toolkit";
import {
  selectAllCrops,
  selectSoldQtyByCrop,
} from "./cropSelectors";
import { selectOrderItems, selectBuyerItems, selectInventoryItems } from "./entitySelectors";
import { selectTaskRows } from "./taskSelectors";

/* Harvest & Orders summary numbers — computed once, in a selector. */
export const selectHarvestSummary = createSelector(
  [selectAllCrops, selectSoldQtyByCrop],
  (crops, soldMap) => {
    const totalHarvest = crops.reduce(
      (sum, crop) => sum + (Number(crop.harvestQty) || 0),
      0
    );
    const quantitySold = Object.values(soldMap).reduce(
      (sum, qty) => sum + qty,
      0
    );
    return {
      cropCount: crops.length,
      totalHarvest,
      quantitySold,
      quantityRemaining: Math.max(0, totalHarvest - quantitySold),
    };
  }
);

export const selectOrdersSummary = createSelector(
  [selectOrderItems, selectBuyerItems],
  (orders, buyers) => {
    const active = orders.filter((order) => order.status !== "Cancelled");
    const delivered = orders.filter((order) => order.status === "Delivered");
    const orderQty = active.reduce((sum, order) => sum + (Number(order.quantity) || 0), 0);
    const buyerQty = buyers.reduce((sum, buyer) => sum + (Number(buyer.quantity) || 0), 0);
    return {
      totalOrders: orders.length,
      activeOrders: active.length,
      deliveredOrders: delivered.length,
      totalBuyers: buyers.length,
      quantitySold: orderQty + buyerQty,
      revenue: delivered.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
    };
  }
);

export const selectOrderStatusCounts = createSelector([selectOrderItems], (orders) => {
  const counts = { Pending: 0, Processing: 0, Packed: 0, Delivered: 0, Cancelled: 0 };
  orders.forEach((order) => {
    const key = order.status;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.keys(counts)
    .filter((key) => counts[key] > 0 || key !== "Cancelled")
    .map((key) => ({ name: key, value: counts[key] }));
});

export const selectOrdersOverTime = createSelector([selectOrderItems], (orders) => {
  const buckets = {};
  orders.forEach((order) => {
    const key = String(order.orderDate || "").slice(0, 7);
    if (!key) return;
    if (!buckets[key]) buckets[key] = { month: key, orders: 0, quantity: 0, revenue: 0 };
    buckets[key].orders += 1;
    buckets[key].quantity += Number(order.quantity) || 0;
    buckets[key].revenue += Number(order.total) || 0;
  });
  return Object.values(buckets)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((bucket) => ({
      ...bucket,
      label: new Date(`${bucket.month}-01T00:00:00`).toLocaleDateString("en-GB", {
        month: "short",
      }),
    }));
});

/* Headline numbers for the dashboard stat cards. */
export const selectDashboardStats = createSelector(
  [selectAllCrops, selectOrdersSummary, selectInventoryItems, selectTaskRows],
  (crops, ordersSummary, inventoryItems, tasks) => ({
    cropCount: crops.length,
    fieldCount: new Set(crops.map((crop) => crop.field)).size,
    totalStock: crops.reduce((sum, crop) => sum + (Number(crop.harvestQty) || 0), 0),
    revenue: ordersSummary.revenue,
    totalOrders: ordersSummary.totalOrders,
    buyerCount: ordersSummary.totalBuyers,
    lowStockCount: inventoryItems.filter(
      (item) => (Number(item.qty) || 0) <= (Number(item.minQty) || 0)
    ).length,
    openTasks: tasks.filter((task) => task.computedStatus !== "Done").length,
    overdueTasks: tasks.filter((task) => task.computedStatus === "Overdue").length,
  })
);
