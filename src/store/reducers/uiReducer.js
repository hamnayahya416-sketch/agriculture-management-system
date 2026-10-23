import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";

export const initialState = {
  theme: "light",
  toast: null,
  sidebarOpen: false,
  sidebarCollapsed: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload === "dark" ? "dark" : "light";
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    showToast(state, action) {
      state.toast = {
        id: action.payload.id || `toast-${Date.now()}`,
        message: action.payload.message,
        tone: action.payload.tone || "success",
      };
    },
    hideToast(state) {
      state.toast = null;
    },
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = Boolean(action.payload);
    },
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    hydrateUi(state, action) {
      state.theme = action.payload.theme === "dark" ? "dark" : "light";
      state.sidebarCollapsed = Boolean(action.payload.sidebarCollapsed);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      const ui = action.payload.ui;
      if (ui) {
        state.theme = ui.theme === "dark" ? "dark" : "light";
        state.sidebarCollapsed = Boolean(ui.sidebarCollapsed);
      }
    });
  },
});

export default uiSlice.reducer;
