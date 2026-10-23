import { createSelector } from "@reduxjs/toolkit";
import { selectAllCrops } from "./cropSelectors";
import { selectOrderItems, selectExpenseItems, selectActivityItems } from "./entitySelectors";

function monthKey(iso) {
  return String(iso || "").slice(0, 7);
}

function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, (month || 1) - 1, 1).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

/* Months that actually contain data (orders / expenses / cuttings), newest first. */
export const selectAvailableMonths = createSelector(
  [selectOrderItems, selectExpenseItems, selectAllCrops],
  (orders, expenses, crops) => {
    const keys = new Set();
    orders.forEach((order) => {
      if (order.orderDate) keys.add(monthKey(order.orderDate));
    });
    expenses.forEach((entry) => {
      if (entry.date) keys.add(monthKey(entry.date));
    });
    crops.forEach((crop) => {
      if (crop.cuttingDate) keys.add(monthKey(crop.cuttingDate));
    });
    return Array.from(keys)
      .filter(Boolean)
      .sort()
      .reverse()
      .map((key) => ({ value: key, label: monthLabel(key) }));
  }
);

/* Monthly report: harvest, sales and expenses for the selected month. */
export const selectMonthlyReport = createSelector(
  [selectAllCrops, selectOrderItems, selectExpenseItems, (_, month) => month],
  (crops, orders, expenses, month) => {
    const key = month || "";
    const harvestRows = crops.filter((crop) => monthKey(crop.cuttingDate) === key);
    const monthOrders = orders.filter(
      (order) => monthKey(order.orderDate) === key && order.status !== "Cancelled"
    );
    const monthExpenses = expenses.filter((entry) => monthKey(entry.date) === key);

    const harvest = harvestRows.reduce(
      (sum, crop) => sum + (Number(crop.harvestQty) || 0),
      0
    );
    const salesQuantity = monthOrders.reduce(
      (sum, order) => sum + (Number(order.quantity) || 0),
      0
    );
    const revenue = monthOrders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0
    );
    const expense = monthExpenses.reduce(
      (sum, entry) => sum + (Number(entry.amount) || 0),
      0
    );

    return {
      month: key,
      harvest,
      harvestCount: harvestRows.length,
      harvestRows,
      salesQuantity,
      revenue,
      orderCount: monthOrders.length,
      orders: monthOrders,
      expense,
      expenseCount: monthExpenses.length,
      expenses: monthExpenses,
      profit: Math.round((revenue - expense) * 100) / 100,
    };
  }
);

/* Latest activity entries for the dashboard feed. */
export const selectRecentActivity = createSelector([selectActivityItems], (items) =>
  items.slice(0, 6)
);
