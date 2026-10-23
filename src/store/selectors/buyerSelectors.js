import { createSelector } from "@reduxjs/toolkit";
import { selectBuyerItems, selectCropItems } from "./entitySelectors";

export const selectAllBuyers = selectBuyerItems;

export const selectBuyerById = (state, buyerId) =>
  selectBuyerItems(state).find((buyer) => String(buyer.id) === String(buyerId)) || null;

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

/* Debounced search by name or CNIC (raw digits, so dashes don't matter). */
export const selectVisibleBuyers = createSelector(
  [selectAllBuyers, selectCropItems, (_, view) => view || {}],
  (buyers, crops, view) => {
    const query = String(view.query || "").trim().toLowerCase();
    const queryDigits = digits(query);

    const withCrop = buyers.map((buyer) => {
      const crop = crops.find((entry) => String(entry.id) === String(buyer.cropId));
      return {
        ...buyer,
        cropName: crop ? crop.name : "—",
        unit: crop ? crop.unit : "kg",
      };
    });

    if (!query) return withCrop;

    return withCrop.filter((buyer) => {
      const byName = String(buyer.name).toLowerCase().includes(query);
      const byCnic = queryDigits
        ? digits(buyer.cnic).includes(queryDigits)
        : false;
      const byCrop = String(buyer.cropName).toLowerCase().includes(query);
      return byName || byCnic || byCrop;
    });
  }
);
