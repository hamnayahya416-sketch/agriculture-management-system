import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";
import { SEED_INVENTORY } from "../../data/seedData";
import { nextPrefixedId } from "../../utils/id";
import { todayIso } from "../../utils/formatters";

export const initialState = {
  items: SEED_INVENTORY.items,
  usage: SEED_INVENTORY.usage,
  status: "idle",
  error: null,
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    add(state, action) {
      const item = { ...action.payload };
      if (!item.id) item.id = nextPrefixedId(state.items, "INV");
      state.items.push(item);
    },
    update(state, action) {
      const { id, ...changes } = action.payload;
      const index = state.items.findIndex((entry) => entry.id === id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...changes };
    },
    remove(state, action) {
      state.items = state.items.filter((entry) => entry.id !== action.payload);
    },
    logUsage(state, action) {
      const { itemId, qty, unit, note, date } = action.payload;
      const item = state.items.find((entry) => entry.id === itemId);
      if (!item) return;
      const used = Number(qty) || 0;
      item.qty = Math.max(0, (Number(item.qty) || 0) - used);
      state.usage.unshift({
        id: nextPrefixedId(state.usage, "USE"),
        itemId: item.id,
        itemName: item.item,
        qty: used,
        unit: unit || item.unit,
        date: date || todayIso(),
        note: note || "",
      });
    },
    setAll(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      const inventory = action.payload.inventory;
      if (inventory && Array.isArray(inventory.items)) {
        state.items = inventory.items;
        state.usage = Array.isArray(inventory.usage) ? inventory.usage : [];
      }
    });
  },
});

export default inventorySlice.reducer;
