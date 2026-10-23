import { createSelector } from "@reduxjs/toolkit";
import { selectTaskItems, selectCropItems } from "./entitySelectors";
import { daysUntil } from "../../utils/formatters";

/* Task rows with the Overdue status computed here (never inside components). */
export const selectTaskRows = createSelector(
  [selectTaskItems, selectCropItems],
  (tasks, crops) =>
    tasks
      .map((task) => {
        const daysRemaining = daysUntil(task.dueDate);
        const crop = crops.find((entry) => String(entry.id) === String(task.cropId));
        let computedStatus = task.status === "Done" ? "Done" : "Pending";
        if (computedStatus === "Pending" && daysRemaining !== null && daysRemaining < 0) {
          computedStatus = "Overdue";
        }
        return {
          ...task,
          cropName: crop ? crop.name : "—",
          daysRemaining,
          computedStatus,
        };
      })
      .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
);

export const selectOverdueTasks = createSelector([selectTaskRows], (rows) =>
  rows.filter((row) => row.computedStatus === "Overdue")
);

export const selectTaskStatusCounts = createSelector([selectTaskRows], (rows) => {
  const counts = { Pending: 0, Done: 0, Overdue: 0 };
  rows.forEach((row) => {
    counts[row.computedStatus] = (counts[row.computedStatus] || 0) + 1;
  });
  return Object.keys(counts).map((name) => ({ name, value: counts[name] }));
});
