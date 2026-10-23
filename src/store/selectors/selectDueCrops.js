import { createSelector } from "@reduxjs/toolkit";
import { selectAllCrops } from "./cropSelectors";
import { daysUntil } from "../../utils/formatters";

const DUE_SOON_DAYS = 3;

/* Full cutting schedule with days remaining and a highlight state. */
export const selectCuttingSchedule = createSelector([selectAllCrops], (crops) =>
  crops
    .map((crop) => {
      const daysRemaining = daysUntil(crop.cuttingDate);
      let state = "On track";
      if (daysRemaining === null) state = "Scheduled";
      else if (daysRemaining < 0) state = "Overdue";
      else if (daysRemaining <= DUE_SOON_DAYS) state = "Due soon";
      return {
        id: crop.id,
        name: crop.name,
        field: crop.field,
        cuttingDate: crop.cuttingDate,
        daysRemaining,
        state,
        harvestQty: Number(crop.harvestQty) || 0,
        healthStatus: crop.status,
      };
    })
    .sort((a, b) => {
      if (a.daysRemaining === null) return 1;
      if (b.daysRemaining === null) return -1;
      return a.daysRemaining - b.daysRemaining;
    })
);

/* Crops due within 3 days or already overdue (used by alerts). */
export const selectDueCrops = createSelector([selectCuttingSchedule], (rows) =>
  rows.filter((row) => row.state === "Overdue" || row.state === "Due soon")
);

export const selectDueSoonCount = createSelector([selectDueCrops], (rows) => rows.length);
