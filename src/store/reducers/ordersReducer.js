import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";
import { SEED_ORDERS } from "../../data/seedData";
import { nextPrefixedId } from "../../utils/id";

export const initialState = {
  items: SEED_ORDERS,
  status: "idle",
  error: null,
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    add(state, action) {
      const order = { ...action.payload };
      if (!order.id) order.id = nextPrefixedId(state.items, "ORD");
      if (order.total === undefined || order.total === null || order.total === "") {
        const price = Number(order.price || 0);
        order.total = Math.round((Number(order.quantity) || 0) * price * 100) / 100;
      }
      state.items.unshift(order);
    },
    update(state, action) {
      const { id, ...changes } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...changes };
    },
    remove(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setStatus(state, action) {
      const { id, status } = action.payload;
      const order = state.items.find((item) => item.id === id);
      if (order) order.status = status;
    },
    setAll(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      if (Array.isArray(action.payload.orders)) state.items = action.payload.orders;
    });
  },
});

export default ordersSlice.reducer;
