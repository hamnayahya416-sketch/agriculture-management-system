import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";

export const initialState = {
  dismissed: [],
};

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    dismiss(state, action) {
      if (!state.dismissed.includes(action.payload)) {
        state.dismissed.push(action.payload);
      }
    },
    dismissAll(state, action) {
      state.dismissed = action.payload || [];
    },
    resetAlerts(state) {
      state.dismissed = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      if (Array.isArray(action.payload.dismissedAlerts)) {
        state.dismissed = action.payload.dismissedAlerts;
      }
    });
  },
});

export const { dismiss, dismissAll, resetAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
