import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";
import { SEED_CROPS } from "../../data/seedData";
import { nextNumericId } from "../../utils/id";

export const initialState = {
  items: SEED_CROPS,
  status: "idle",
  error: null,
};

export const cropsSlice = createSlice({
  name: "crops",
  initialState,
  reducers: {
    add(state, action) {
      const crop = { ...action.payload };
      if (crop.id === undefined || crop.id === null || crop.id === "") {
        crop.id = nextNumericId(state.items);
      }
      state.items.push(crop);
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
      if (Array.isArray(action.payload.crops)) state.items = action.payload.crops;
    });
  },
});

export default cropsSlice.reducer;
