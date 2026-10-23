import { uiSlice } from "../reducers/uiReducer";

/* Action types: ui/setTheme, ui/toggleTheme, ui/showToast, ui/hideToast, ui/openSidebar … */
export const {
  setTheme,
  toggleTheme,
  showToast,
  hideToast,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  hydrateUi,
} = uiSlice.actions;
