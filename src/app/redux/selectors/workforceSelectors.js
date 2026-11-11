import { createSelector } from "@reduxjs/toolkit";
import {
  selectWorkerItems,
  selectAttendanceItems,
  selectEquipmentItems,
  selectMaintenanceItems,
} from "./entitySelectors.js";
import { todayIso, dayOffsetIso, daysUntil, toIsoDate, parseIsoDate } from "../../utils/formatters.js";

function addDays(iso, days) {
  return toIsoDate(new Date(parseIsoDate(iso).getTime() + days * 86400000));
}

/* ------------------------------------------------------------ attendance */
export const selectAttendanceForDate = createSelector(
  [selectAttendanceItems, (_, date) => date || todayIso()],
  (records, date) => records.filter((record) => record.date === date)
);

export const selectPresentCount = createSelector([selectAttendanceForDate], (records) =>
  records.filter((record) => record.status === "Present").length
);

/* Active workers marked Present on the given date (defaults to today). */
export const selectWorkersPresentToday = createSelector(
  [selectWorkerItems, selectAttendanceForDate],
  (workers, records) => {
    const present = new Set(
      records
        .filter((record) => record.status === "Present")
        .map((record) => String(record.workerId))
    );
    return workers.filter(
      (worker) => worker.status !== "Inactive" && present.has(String(worker.id))
    );
  }
);

/* Wages of everyone present today — what the farm owes for the day. */
export const selectWagesPayable = createSelector([selectWorkersPresentToday], (workers) =>
  workers.reduce((sum, worker) => sum + (Number(worker.wage) || 0), 0)
);

/* Present head-count for the last 7 days (drives the attendance chart). */
export const selectAttendanceTrend = createSelector([selectAttendanceItems], (records) => {
  const byDate = {};
  records.forEach((record) => {
    if (record.status !== "Present") return;
    byDate[record.date] = (byDate[record.date] || 0) + 1;
  });
  return Array.from({ length: 7 }, (_, index) => {
    const date = dayOffsetIso(-(6 - index));
    const day = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });
    return { date, day, present: byDate[date] || 0 };
  });
});

/* -------------------------------------------------------------- equipment */
/* Operational / Under Repair / Idle counts for the doughnut chart. */
export const selectEquipmentStatusCount = createSelector([selectEquipmentItems], (items) => {
  const counts = { Operational: 0, "Under Repair": 0, Idle: 0 };
  items.forEach((item) => {
    const key = counts[item.status] !== undefined ? item.status : "Idle";
    counts[key] += 1;
  });
  return Object.keys(counts).map((name) => ({ name, value: counts[name] }));
});

/* Equipment whose next service falls within `withinDays` (default 14). */
export const selectServiceDue = createSelector(
  [selectEquipmentItems, (_, withinDays) => withinDays || 14],
  (items, withinDays) =>
    items
      .map((item) => {
        const interval = Number(item.serviceIntervalDays) || 60;
        const dueDate = item.lastServiceDate
          ? addDays(item.lastServiceDate, interval)
          : todayIso();
        return { ...item, dueDate, daysLeft: daysUntil(dueDate) };
      })
      .filter((item) => item.daysLeft <= withinDays)
      .sort((a, b) => a.daysLeft - b.daysLeft)
);

/* ----------------------------------------------------------- maintenance */
export const selectMaintenanceStats = createSelector(
  [selectMaintenanceItems],
  (services) => {
    const totalCost = services.reduce((sum, entry) => sum + (Number(entry.cost) || 0), 0);
    const thisMonth = services.filter(
      (entry) => String(entry.date || "").slice(0, 7) === todayIso().slice(0, 7)
    );
    return {
      totalCost,
      thisMonthCost: thisMonth.reduce((sum, entry) => sum + (Number(entry.cost) || 0), 0),
      count: services.length,
    };
  }
);

/* Latest service per equipment — feeds the "last serviced" column. */
export const selectLatestServiceByEquipment = createSelector(
  [selectMaintenanceItems],
  (services) => {
    const map = {};
    services.forEach((entry) => {
      const key = String(entry.equipmentId);
      if (!map[key] || String(entry.date) > String(map[key].date)) map[key] = entry;
    });
    return map;
  }
);
