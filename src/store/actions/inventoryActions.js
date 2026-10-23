import { inventorySlice } from "../reducers/inventoryReducer";

/* Action types: inventory/add, inventory/update, inventory/remove, inventory/logUsage */
export const {
  add: addInventoryItem,
  update: updateInventoryItem,
  remove: removeInventoryItem,
  logUsage: logInventoryUsage,
  setAll: setAllInventory,
} = inventorySlice.actions;
