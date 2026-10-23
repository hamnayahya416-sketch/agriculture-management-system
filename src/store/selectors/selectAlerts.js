import { createSelector } from "@reduxjs/toolkit";
import { selectAllCrops, selectStockRows } from "./cropSelectors";
import { selectWeatherState, selectInventoryItems, selectDismissedAlerts } from "./entitySelectors";
import { selectCuttingSchedule } from "./selectDueCrops";
import { selectTaskRows } from "./taskSelectors";
import { selectStockStatus } from "./selectLowStock";
import { formatDate } from "../../utils/formatters";

const HUMIDITY_HIGH = 70;
const CROP_STOCK_MIN = 500;

function buildAlerts(crops, cuttingRows, tasks, inventoryItems, weather, stockRows) {
  const alerts = [];

  if (weather.status === "succeeded" && weather.data) {
    const humidity = weather.data.current.humidity;
    if (humidity >= HUMIDITY_HIGH) {
      alerts.push({
        id: "weather-humidity-high",
        severity: "danger",
        title: "High humidity",
        message: `Humidity is ${humidity}%. Watch for fungal disease.`,
      });
    }
  }

  if (weather.status === "failed" && weather.error) {
    alerts.push({
      id: "weather-error",
      severity: "warning",
      title: "Weather unavailable",
      message: weather.error,
    });
  }

  inventoryItems.forEach((item) => {
    const status = selectStockStatus(item);
    if (status !== "In stock") {
      alerts.push({
        id: `inventory-${item.id}`,
        severity: status === "Out of stock" ? "danger" : "warning",
        title: status === "Out of stock" ? "Input out of stock" : "Low inventory",
        message: `${item.item}: ${item.qty} ${item.unit} left (min ${item.minQty}).`,
      });
    }
  });

  stockRows.forEach((row) => {
    if (row.available <= CROP_STOCK_MIN) {
      alerts.push({
        id: `crop-stock-${row.id}`,
        severity: "warning",
        title: "Low stock",
        message: `${row.name} has only ${row.available.toLocaleString()} ${row.unit} left.`,
      });
    }
  });

  crops.forEach((crop) => {
    if (crop.status === "Critical") {
      alerts.push({
        id: `crop-critical-${crop.id}`,
        severity: "danger",
        title: "Critical crop health",
        message: `${crop.name} in ${crop.field} needs immediate attention.`,
      });
    }
  });

  cuttingRows.forEach((row) => {
    if (row.state === "Overdue" || row.state === "Due soon") {
      alerts.push({
        id: `cutting-${row.id}`,
        severity: row.state === "Overdue" ? "danger" : "warning",
        title: row.state === "Overdue" ? "Cutting overdue" : "Cutting due soon",
        message: `${row.name} cutting on ${formatDate(row.cuttingDate)} (${row.daysRemaining} days).`,
      });
    }
  });

  tasks.forEach((task) => {
    if (task.computedStatus === "Overdue") {
      alerts.push({
        id: `task-${task.id}`,
        severity: "warning",
        title: "Overdue task",
        message: `${task.title} was due ${formatDate(task.dueDate)}.`,
      });
    }
  });

  return alerts;
}

/* Every dashboard / bell alert, derived from slices and filtered by dismissals. */
export const selectAlerts = createSelector(
  [
    selectAllCrops,
    selectCuttingSchedule,
    selectTaskRows,
    selectInventoryItems,
    selectWeatherState,
    selectStockRows,
    selectDismissedAlerts,
  ],
  (crops, cuttingRows, tasks, inventoryItems, weather, stockRows, dismissed) =>
    buildAlerts(crops, cuttingRows, tasks, inventoryItems, weather, stockRows).filter(
      (alert) => !dismissed.includes(alert.id)
    )
);

export const selectAlertCount = createSelector([selectAlerts], (alerts) => alerts.length);

export const selectAlertsBySeverity = createSelector([selectAlerts], (alerts) => ({
  danger: alerts.filter((alert) => alert.severity === "danger"),
  warning: alerts.filter((alert) => alert.severity === "warning"),
}));
