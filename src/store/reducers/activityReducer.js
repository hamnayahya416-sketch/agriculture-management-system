import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";
import { SEED_ACTIVITY } from "../../data/seedData";
import { nextPrefixedId } from "../../utils/id";

const MAX_ENTRIES = 300;

export const initialState = {
  items: SEED_ACTIVITY,
};

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    log(state, action) {
      const entry = { ...action.payload };
      if (!entry.id) entry.id = nextPrefixedId(state.items, "ACT");
      if (!entry.timestamp) entry.timestamp = new Date().toISOString();
      state.items.unshift(entry);
      if (state.items.length > MAX_ENTRIES) {
        state.items.length = MAX_ENTRIES;
      }
    },
    clear(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      if (Array.isArray(action.payload.activity)) state.items = action.payload.activity;
    });
  },
});

export const { clear: clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
