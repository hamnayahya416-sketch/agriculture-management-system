import { createSlice } from "@reduxjs/toolkit";
import { fetchWeather } from "../thunks/fetchWeather";

export const initialState = {
  status: "idle", // idle | loading | succeeded | failed
  data: null,
  error: null,
  lastUpdated: null,
};

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    reset(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message || "Unable to load weather.";
      });
  },
});

export const { reset: resetWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
