import { createSelector } from "@reduxjs/toolkit";
import { selectAllCrops } from "./cropSelectors";
import { selectOrderItems, selectExpenseItems } from "./entitySelectors";

const MONTHS_BACK = 6;

function monthKey(iso) {
  return String(iso || "").slice(0, 7);
}

function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, (month || 1) - 1, 1).toLocaleDateString("en-GB", {
    month: "short",
  });
}

function recentMonthKeys() {
  const keys = [];
  const now = new Date();
  for (let i = MONTHS_BACK - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

/* Revenue minus expenses, per crop. */
export const selectProfitByCrop = createSelector(
  [selectAllCrops, selectOrderItems, selectExpenseItems],
  (crops, orders, expenses) =>
    crops.map((crop) => {
      const revenue = orders
        .filter((order) => order.cropId === crop.id && order.status !== "Cancelled")
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
      const expense = expenses
        .filter((entry) => entry.cropId === crop.id)
        .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
      return {
        cropId: crop.id,
        name: crop.name,
        revenue,
        expense,
        profit: revenue - expense,
      };
    })
);

export const selectProfitTotals = createSelector([selectProfitByCrop], (rows) =>
  rows.reduce(
    (totals, row) => ({
      revenue: totals.revenue + row.revenue,
      expense: totals.expense + row.expense,
      profit: totals.profit + row.profit,
    }),
    { revenue: 0, expense: 0, profit: 0 }
  )
);

/* Monthly revenue vs expense series for ProfitLossChart. */
export const selectProfitLossSeries = createSelector(
  [selectOrderItems, selectExpenseItems],
  (orders, expenses) =>
    recentMonthKeys().map((key) => {
      const revenue = orders
        .filter(
          (order) =>
            monthKey(order.orderDate) === key && order.status !== "Cancelled"
        )
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);
      const expense = expenses
        .filter((entry) => monthKey(entry.date) === key)
        .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
      return {
        month: key,
        label: monthLabel(key),
        revenue: Math.round(revenue * 100) / 100,
        expense,
        profit: Math.round((revenue - expense) * 100) / 100,
      };
    })
);
