import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";
import { SEED_BUYERS } from "../../data/seedData";
import { nextPrefixedId } from "../../utils/id";

export const initialState = {
  items: SEED_BUYERS,
  status: "idle",
  error: null,
};

export const buyersSlice = createSlice({
  name: "buyers",
  initialState,
  reducers: {
    add(state, action) {
      const buyer = { ...action.payload };
      if (!buyer.id) buyer.id = nextPrefixedId(state.items, "BYR");
      state.items.unshift(buyer);
    },
    update(state, action) {
      const { id, ...changes } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...changes };
    },
    remove(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setAll(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      if (Array.isArray(action.payload.buyers)) state.items = action.payload.buyers;
    });
  },
});

export default buyersSlice.reducer;
